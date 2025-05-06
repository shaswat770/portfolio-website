async function uploadPDF() {
    const fileInput = document.getElementById('pdfUpload');
    const file = fileInput.files[0];

    if (!file) {
        alert('Please upload a PDF file!');
        return;
    }

    const formData = new FormData();
    formData.append('pdf', file);

    document.getElementById('loadingSection').style.display = 'block';

    let estimatedTime = 10;
    const interval = setInterval(() => {
        estimatedTime--;
        document.getElementById('estimatedTime').textContent = estimatedTime;
        if (estimatedTime <= 0) clearInterval(interval);
    }, 1000);

    try {
        const response = await fetch('/process-resume', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Error processing the PDF file.');
        }

        const sections = await response.json();

        document.getElementById('loadingSection').style.display = 'none';
        document.getElementById('portfolioContainer').style.display = 'block';

        document.getElementById('summarySection').innerHTML = `<h2>Summary</h2><p>${sections.Summary}</p>`;
        document.getElementById('skillsSection').innerHTML = `<h2>Skills</h2><p>${sections.Skills}</p>`;
        document.getElementById('experienceSection').innerHTML = `<h2>Experience</h2><p>${sections.Experience}</p>`;
        document.getElementById('projectsSection').innerHTML = `<h2>Projects</h2><p>${sections.Projects}</p>`;
        document.getElementById('educationSection').innerHTML = `<h2>Education</h2><p>${sections.Education}</p>`;
        document.getElementById('certificationsSection').innerHTML = `<h2>Certifications</h2><p>${sections.Certifications}</p>`;
    } catch (error) {
        alert('Error processing the PDF file. Please try again.');
    } finally {
        document.getElementById('loadingSection').style.display = 'none'; 
        clearInterval(interval); 
    }
}

function resetForm() {
    document.getElementById('pdfUpload').value = "";
    document.getElementById('fileName').textContent = 'No file chosen';

    document.getElementById('summarySection').innerHTML = '';
    document.getElementById('skillsSection').innerHTML = '';
    document.getElementById('experienceSection').innerHTML = '';
    document.getElementById('projectsSection').innerHTML = '';
    document.getElementById('educationSection').innerHTML = '';
    document.getElementById('certificationsSection').innerHTML = '';

    document.getElementById('portfolioContainer').style.display = 'none';

    document.getElementById('loadingSection').style.display = 'none';
    document.getElementById('estimatedTime').textContent = '10';

    clearInterval(interval);
}


document.querySelectorAll('.taskbar a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();

        const target = document.querySelector(this.getAttribute('href'));
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });

        document.querySelectorAll('.taskbar-item').forEach(item => {
            item.classList.remove('active');
        });

        this.classList.add('active');
    });
});

document.getElementById('darkModeToggle').addEventListener('click', function () {
    document.body.classList.toggle('dark-mode');
    
    if (document.body.classList.contains('dark-mode')) {
        themeIcon.src = 'static/sun (1).png'; 
        themeIcon.alt = 'Light Mode';
    } else {
        themeIcon.src = 'static/moon (1).png'; 
        themeIcon.alt = 'Dark Mode';
    }
});

document.getElementById('pdfUpload').addEventListener('change', updateFileName);

function updateFileName() {
    const fileInput = document.getElementById('pdfUpload');
    const fileNameDisplay = document.getElementById('fileName');
    if (fileInput.files.length > 0) {
        fileNameDisplay.textContent = fileInput.files[0].name;
    } else {
        fileNameDisplay.textContent = 'No file chosen';
    }
}

document.querySelectorAll('.toggle-content').forEach(button => {
    button.addEventListener('click', function() {
        const contentId = this.getAttribute('aria-controls');
        const content = document.getElementById(contentId);
        const isExpanded = this.getAttribute('aria-expanded') === 'true';

        this.setAttribute('aria-expanded', !isExpanded);
        content.style.display = isExpanded ? 'none' : 'block'; 
    });
});

const scrollUpButton = document.querySelector('.scrollUpButton');

window.addEventListener('scroll', () => {
  if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
    scrollUpButton.classList.add('show');
  } else {
    scrollUpButton.classList.remove('show');
  }
});

scrollUpButton.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});



