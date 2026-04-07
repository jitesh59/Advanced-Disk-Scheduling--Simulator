const canvas = document.getElementById('diskCanvas');
const ctx = canvas.getContext('2d');
const DISK_SIZE = 350;
const CENTER_X = 200;
const CENTER_Y = 200;
const MAX_TRACK = 199;

let animationId, headPos = 53, currentSequence = [];

// Core Algorithms
function FCFS(requests, head) {
    const sequence = [head, ...requests];
    let totalSeek = 0;
    for (let i = 1; i < sequence.length; i++) {
        totalSeek += Math.abs(sequence[i] - sequence[i-1]);
    }
    return { sequence, totalSeek, avgSeek: totalSeek / (sequence.length - 1), throughput: requests.length / (totalSeek / 1000) };
}

function SSTF(requests, head) {
    let remaining = [...requests];
    let sequence = [head];
    let current = head;
    while (remaining.length > 0) {
        let nearest = remaining.reduce((prev, curr) => 
            Math.abs(curr - current) < Math.abs(prev - current) ? curr : prev
        );
        sequence.push(nearest);
        current = nearest;
        remaining = remaining.filter(r => r !== nearest);
    }
    let totalSeek = sequence.slice(1).reduce((sum, pos, i) => sum + Math.abs(pos - sequence[i]), 0);
    return { sequence, totalSeek, avgSeek: totalSeek / (sequence.length - 1), throughput: requests.length / (totalSeek / 1000) };
}

function SCAN(requests, head) {
    let left = requests.filter(r => r <= head).sort((a,b) => b-a);
    let right = requests.filter(r => r > head).sort((a,b) => a-b);
    let sequence = [head, ...right, MAX_TRACK, 0, ...left];
    let totalSeek = sequence.slice(1).reduce((sum, pos, i) => sum + Math.abs(pos - sequence[i]), 0);
    return { sequence, totalSeek, avgSeek: totalSeek / (sequence.length - 1), throughput: requests.length / (totalSeek / 1000) };
}

function CSCAN(requests, head) {
    let sorted = requests.sort((a,b) => a-b);
    let sequence = [head, ...sorted.filter(r => r >= head), MAX_TRACK, 0, ...sorted.filter(r => r < head)];
    let totalSeek = sequence.slice(1).reduce((sum, pos, i) => sum + Math.abs(pos - sequence[i]), 0);
    return { sequence, totalSeek, avgSeek: totalSeek / (sequence.length - 1), throughput: requests.length / (totalSeek / 1000) };
}

const algorithms = { fcfs: FCFS, sstf: SSTF, scan: SCAN, cscan: CSCAN };

function runSimulation() {
    const requestsInput = document.getElementById('requests').value;
    const requests = requestsInput.split(',').map(Number).filter(n => !isNaN(n) && n >= 0 && n <= MAX_TRACK);
    const head = parseInt(document.getElementById('head').value) || 53;
    const algo = document.getElementById('algorithm').value;
    
    if (requests.length === 0) return alert('Enter valid disk requests!');
    
    const result = algorithms[algo](requests, head);
    currentSequence = result.sequence;
    headPos = head;
    
    updateMetrics(result);
    updateSequence(result.sequence);
    animateHead();
    
    document.getElementById('comparison').classList.add('hidden');
}

function compareAll() {
    const requestsInput = document.getElementById('requests').value;
    const requests = requestsInput.split(',').map(Number).filter(n => !isNaN(n) && n >= 0 && n <= MAX_TRACK);
    const head = parseInt(document.getElementById('head').value) || 53;
    
    if (requests.length === 0) return alert('Enter valid disk requests!');
    
    const results = {};
    Object.keys(algorithms).forEach(algo => {
        results[algo.toUpperCase()] = algorithms[algo](requests, head);
    });
    
    createComparisonChart(results);
    document.getElementById('comparison').classList.remove('hidden');
}

function updateMetrics(result) {
    document.getElementById('total-seek').textContent = `${result.totalSeek} ms`;
    document.getElementById('avg-seek').textContent = `${result.avgSeek.toFixed(1)} ms`;
    document.getElementById('throughput').textContent = `${result.throughput.toFixed(1)} req/ms`;
}

function updateSequence(sequence) {
    document.getElementById('sequence').textContent = `Head Movement: ${sequence.join(' → ')}`;
}

function animateHead() {
    cancelAnimationFrame(animationId);
    let step = 0;
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawDisk();
        
        if (step < currentSequence.length) {
            const targetTrack = currentSequence[step];
            drawHead(targetTrack);
            drawTrack(targetTrack);
            step++;
            animationId = requestAnimationFrame(animate);
        }
    }
    animate();
}

function drawDisk() {
    ctx.strokeStyle = '#667eea';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(CENTER_X, CENTER_Y, DISK_SIZE/2, 0, 2 * Math.PI);
    ctx.stroke();
    
    // Track labels
    ctx.fillStyle = '#333';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    for (let i = 0; i <= 10; i++) {
        const angle = (i / 10) * 2 * Math.PI;
        const track = Math.round((i / 10) * MAX_TRACK);
        const x = CENTER_X + (DISK_SIZE/2 - 30) * Math.cos(angle);
        const y = CENTER_Y + (DISK_SIZE/2 - 30) * Math.sin(angle);
        ctx.fillText(track, x, y);
    }
}

function drawHead(track) {
    const angle = (track / MAX_TRACK) * 2 * Math.PI;
    const x = CENTER_X + (DISK_SIZE/2 - 20) * Math.cos(angle);
    const y = CENTER_Y + (DISK_SIZE/2 - 20) * Math.sin(angle);
    
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle + Math.PI/2);
    ctx.fillStyle = '#ff6b6b';
    ctx.shadowColor = '#ff6b6b';
    ctx.shadowBlur = 20;
    ctx.beginPath();
    ctx.moveTo(0, -15);
    ctx.lineTo(8, 5);
    ctx.lineTo(-8, 5);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
}

function drawTrack(track) {
    const angle = (track / MAX_TRACK) * 2 * Math.PI;
    const x = CENTER_X + (DISK_SIZE/2 - 40) * Math.cos(angle);
    const y = CENTER_Y + (DISK_SIZE/2 - 40) * Math.sin(angle);
    
    ctx.fillStyle = 'rgba(255, 107, 107, 0.3)';
    ctx.beginPath();
    ctx.arc(x, y, 8, 0, 2 * Math.PI);
    ctx.fill();
}

function createComparisonChart(results) {
    const compareCtx = document.getElementById('compareChart').getContext('2d');
    const labels = Object.keys(results);
    const totalSeeks = labels.map(algo => results[algo].totalSeek);
    
    new Chart(compareCtx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Total Seek Time (ms)',
                data: totalSeeks,
                backgroundColor: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24']
            }]
        },
        options: {
            responsive: true,
            scales: { y: { beginAtZero: true } },
            plugins: { legend: { display: false } }
        }
    });
}

// Include Chart.js CDN in HTML head for charts:
// <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>