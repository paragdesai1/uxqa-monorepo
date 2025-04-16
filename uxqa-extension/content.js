if (window.location.search.includes('project_id')) {
  const projectId = new URLSearchParams(window.location.search).get('project_id');

  fetch(`https://uxqa-backend.onrender.com/api/project/${projectId}`)
    .then(res => res.json())
    .then(data => {
      if (!data.frames?.length) return;

      const overlay = document.createElement('img');
      overlay.src = data.frames[0];
      overlay.style.position = 'fixed';
      overlay.style.top = 0;
      overlay.style.left = 0;
      overlay.style.width = '100vw';
      overlay.style.height = '100vh';
      overlay.style.zIndex = '999999';
      overlay.style.opacity = '0.5';
      overlay.style.pointerEvents = 'none';
      document.body.appendChild(overlay);
    });
}