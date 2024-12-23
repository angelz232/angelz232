let draggedElement = null;
let isSelecting = false;
let selectionStartX, selectionStartY, selectionBox;


function dragStart(event) {

    if (event.target.closest('.icon-container') && !event.target.closest('.folder-content')) {
        draggedElement = event.target.closest('.icon-container');
        event.dataTransfer.setData("text/plain", draggedElement.id);
    }
}

document.addEventListener("dragover", function(event) {
    event.preventDefault(); 
});

document.addEventListener("drop", function(event) {
    event.preventDefault();

    if (draggedElement && (event.target.classList.contains("desktop") || event.target === draggedElement)) {
        let gridSize = 100; 
        let dropX = Math.floor(event.clientX / gridSize) * gridSize;
        let dropY = Math.floor(event.clientY / gridSize) * gridSize;

        draggedElement.style.position = 'absolute';
        draggedElement.style.left = dropX + "px";
        draggedElement.style.top = dropY + "px";
    }
    draggedElement = null; 
});


document.addEventListener("click", function(event) {
    if (event.target.closest('.icon-container') && !event.target.closest('.folder-content')) {
        let icon = event.target.closest('.icon-container');

        icon.classList.toggle('selected');
    }
});

document.addEventListener("mousedown", function(event) {
    if (event.target.classList.contains('desktop')) {
        isSelecting = true;
        selectionStartX = event.clientX;
        selectionStartY = event.clientY;

        selectionBox = document.getElementById('selection-box');
        selectionBox.style.left = selectionStartX + "px";
        selectionBox.style.top = selectionStartY + "px";
        selectionBox.style.width = 0;
        selectionBox.style.height = 0;
        selectionBox.style.display = "block"; 
    }
});

document.addEventListener("mousemove", function(event) {
    if (isSelecting) {
        let currentX = event.clientX;
        let currentY = event.clientY;

        selectionBox.style.left = Math.min(currentX, selectionStartX) + "px";
        selectionBox.style.top = Math.min(currentY, selectionStartY) + "px";
        selectionBox.style.width = Math.abs(currentX - selectionStartX) + "px";
        selectionBox.style.height = Math.abs(currentY - selectionStartY) + "px";

        selectIconsInBox();
    }
});

document.addEventListener("mouseup", function() {
    if (isSelecting) {
        isSelecting = false;
        selectionBox.style.display = "none";
    }
});

function selectIconsInBox() {
    let selectionRect = selectionBox.getBoundingClientRect();
    
    let desktopIcons = document.querySelectorAll('.desktop .icon-container');
    desktopIcons.forEach(function(icon) {
        let iconRect = icon.getBoundingClientRect();
        if (iconRect.left < selectionRect.right &&
            iconRect.right > selectionRect.left &&
            iconRect.top < selectionRect.bottom &&
            iconRect.bottom > selectionRect.top) {
            icon.classList.add('selected');
        } else {
            icon.classList.remove('selected');
        }
    });

    let folderIcons = document.querySelectorAll('.folder-content .icon-container');
    folderIcons.forEach(function(icon) {
        let iconRect = icon.getBoundingClientRect();
        if (iconRect.left < selectionRect.right &&
            iconRect.right > selectionRect.left &&
            iconRect.top < selectionRect.bottom &&
            iconRect.bottom > selectionRect.top) {
            icon.classList.add('selected');
        } else {
            icon.classList.remove('selected');
        }
    });
}


function openSite(url) {
    window.open(url, '_blank'); 
}



function openGuestbook() {
    const guestbook = document.getElementById('guestbook');
    guestbook.style.display = 'block'; 
    guestbook.style.top = '100px';     
    guestbook.style.left = '100px';    

    fetch('/guestbook/messages', {
        method: 'GET'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        const messagesDiv = document.getElementById('guestbook-messages');
        messagesDiv.innerHTML = ''; 

        if (data.messages && data.messages.length > 0) {
            data.messages.forEach(msg => {
                messagesDiv.innerHTML += `<p><strong>${msg.name}</strong>: ${msg.message}</p>`;
            });
        } else {
            messagesDiv.innerHTML = '<p>No messages yet!</p>';
        }
    })
    .catch(error => console.error('Error fetching messages:', error));
}


function closeGuestbook() {
    const guestbook = document.getElementById('guestbook');
    guestbook.style.display = 'none'; 
}
function submitGuestbook() {
    const name = document.getElementById('guest-name').value;
    const message = document.getElementById('guest-message').value;

    if (!name || !message) {
        alert("Please fill out both fields!");
        return;
    }

    fetch('/guestbook/submit_guestbook', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            'name': name,
            'message': message
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const messagesDiv = document.getElementById('guestbook-messages');
            messagesDiv.innerHTML += `<p><strong>${name}</strong>: ${message}</p>`;
            document.getElementById('guest-name').value = '';
            document.getElementById('guest-message').value = '';
        } else {
            alert(data.error);
        }
    })
    .catch(error => console.error('Error:', error));
}

function makeDraggable(element) {
    let posX = 0, posY = 0, initialX = 0, initialY = 0;

    const header = element.querySelector(".txt-header");
    if (header) {
        header.onmousedown = dragMouseDown;
    } else {
        element.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        e.preventDefault();
        initialX = e.clientX;
        initialY = e.clientY;

        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e.preventDefault();
        posX = initialX - e.clientX;
        posY = initialY - e.clientY;
        initialX = e.clientX;
        initialY = e.clientY;

        element.style.top = (element.offsetTop - posY) + "px";
        element.style.left = (element.offsetLeft - posX) + "px";
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

document.addEventListener("DOMContentLoaded", function() {
    makeDraggable(document.getElementById("guestbook"));
});
