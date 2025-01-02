let draggedFolder = null;
let offsetX, offsetY;
let isResizing = false;
let currentResizer;
const minWidth = 150;
const minHeight = 100;

function keepFolderInBounds(folder) {
    const rect = folder.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    if (rect.left < 0) {
        folder.style.left = '0px';
    }
    if (rect.top < 0) {
        folder.style.top = '0px';
    }
    if (rect.right > viewportWidth) {
        folder.style.left = `${viewportWidth - rect.width}px`;
    }
    if (rect.bottom > viewportHeight) {
        folder.style.top = `${viewportHeight - rect.height}px`;
    }
}

function toggleFolder(folderId) {
    const folder = document.getElementById(folderId);
    if (folder.style.display === "none") {
        folder.style.display = "block";
        enableDragging(folderId);
        enableResizing(folderId);

        folder.style.zIndex = 1000;
        folder.style.position = 'absolute';
    } else {
        folder.style.display = "none"; 
    }
}

function enableDragging(folderId) {
    const folder = document.getElementById(folderId);
    const header = folder.querySelector('.folder-header');

    header.addEventListener('mousedown', function(event) {
        event.preventDefault(); 
        draggedFolder = folder;

        const rect = folder.getBoundingClientRect();
        offsetX = event.clientX - rect.left;
        offsetY = event.clientY - rect.top;

        document.addEventListener('mousemove', dragFolder);
        document.addEventListener('mouseup', stopDraggingFolder);
    });
}

function dragFolder(event) {
    if (draggedFolder) {
        draggedFolder.style.position = 'absolute'; 
        let newX = event.clientX - offsetX;
        let newY = event.clientY - offsetY;

        if (newX < 0) newX = 0;
        if (newY < 0) newY = 0;
        if (newX + draggedFolder.offsetWidth > window.innerWidth) newX = window.innerWidth - draggedFolder.offsetWidth;
        if (newY + draggedFolder.offsetHeight > window.innerHeight) newY = window.innerHeight - draggedFolder.offsetHeight;

        draggedFolder.style.left = newX + 'px';
        draggedFolder.style.top = newY + 'px';
    }
}

function stopDraggingFolder() {
    document.removeEventListener('mousemove', dragFolder);
    document.removeEventListener('mouseup', stopDraggingFolder);
    draggedFolder = null;
}

function enableResizing(folderId) {
    const folder = document.getElementById(folderId);
    const resizers = folder.querySelectorAll('.resizer');

    resizers.forEach(function(resizer) {
        resizer.addEventListener('mousedown', function(e) {
            isResizing = true;
            currentResizer = resizer;

            const boundResize = resizeFolder.bind(null, folder);

            document.addEventListener('mousemove', boundResize);
            document.addEventListener('mouseup', function stopResize() {
                document.removeEventListener('mousemove', boundResize);
                document.removeEventListener('mouseup', stopResize);
                isResizing = false;
            });
        });
    });
}
function resizeFolder(folder, e) {
    if (isResizing) {
        const rect = folder.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        if (currentResizer.classList.contains('right')) {
            const newWidth = e.clientX - rect.left;
            if (newWidth >= minWidth && (rect.left + newWidth) <= viewportWidth) {
                folder.style.width = newWidth + 'px';
            }
        }

        if (currentResizer.classList.contains('left')) {
            const newWidth = rect.right - e.clientX;
            if (newWidth >= minWidth && e.clientX >= 0) {
                folder.style.width = newWidth + 'px';
                folder.style.left = e.clientX + 'px'; 
            }
        }

        if (currentResizer.classList.contains('bottom')) {
            const newHeight = e.clientY - rect.top;
            if (newHeight >= minHeight && (rect.top + newHeight) <= viewportHeight) {
                folder.style.height = newHeight + 'px';
            }
        }

        if (currentResizer.classList.contains('top')) {
            const newHeight = rect.bottom - e.clientY;
            if (newHeight >= minHeight && e.clientY >= 0) {
                folder.style.height = newHeight + 'px';
                folder.style.top = e.clientY + 'px'; 
            }
        }

        if (currentResizer.classList.contains('top-left')) {
            const newWidth = rect.right - e.clientX;
            const newHeight = rect.bottom - e.clientY;

            if (newWidth >= minWidth && e.clientX >= 0) {
                folder.style.width = newWidth + 'px';
            }
            if (newHeight >= minHeight && e.clientY >= 0) {
                folder.style.height = newHeight + 'px';
            }

            if (newWidth >= minWidth && e.clientX >= 0) {
                folder.style.left = e.clientX + 'px'; 
            }
            if (newHeight >= minHeight && e.clientY >= 0) {
                folder.style.top = e.clientY + 'px'; 
            }
        }

        if (currentResizer.classList.contains('top-right')) {
            const newWidth = e.clientX - rect.left;
            const newHeight = rect.bottom - e.clientY;
            if (newWidth >= minWidth && (rect.left + newWidth) <= viewportWidth) {
                folder.style.width = newWidth + 'px';
            }
            if (newHeight >= minHeight && e.clientY >= 0) {
                folder.style.height = newHeight + 'px';
                folder.style.top = e.clientY + 'px'; 
            }
        }

        if (currentResizer.classList.contains('bottom-left')) {
            const newWidth = rect.right - e.clientX;
            const newHeight = e.clientY - rect.top;
            if (newWidth >= minWidth && e.clientX >= 0) {
                folder.style.width = newWidth + 'px';
                folder.style.left = e.clientX + 'px'; 
            }
            if (newHeight >= minHeight && (rect.top + newHeight) <= viewportHeight) {
                folder.style.height = newHeight + 'px';
            }
        }

        if (currentResizer.classList.contains('bottom-right')) {
            const newWidth = e.clientX - rect.left;
            const newHeight = e.clientY - rect.top;

            if (newWidth >= minWidth && (rect.left + newWidth) <= viewportWidth) {
                folder.style.width = newWidth + 'px';
            }

            if (newHeight >= minHeight && (rect.top + newHeight) <= viewportHeight) {
                folder.style.height = newHeight + 'px';
            }
        }
    }
}
// Do 'ID e.g Public.txt': ' Message here '
const fileContents = {
    'Public.txt': `-----BEGIN PGP PUBLIC KEY BLOCK-----
Comment: User-ID:     obey
Comment: Valid from:  06/05/2024 23:46
Comment: Valid until: 06/05/2027 12:00
Comment: Type:        255-bit EdDSA (secret key available)
Comment: Usage:       Signing, Encryption, Certifying User-IDs
Comment: Fingerprint: 9CD0D6E8A799389160346B3B4B4C852E766CBAD0


mDMEZ2jGkRYJKwYBBAHaRw8BAQdAnRiEq3kZDKRu8ndPNNfahQY2UOCCB/A/20w4
8Rc118m0E29iZXkgPGltQHRyb2xsaS5uZz6ImQQTFgoAQRYhBJzQ1uinmTiRYDRr
O0tMhS52bLrQBQJnaMaRAhsDBQkFo5qABQsJCAcCAiICBhUKCQgLAgQWAgMBAh4H
AheAAAoJEEtMhS52bLrQ70wA/R3/xMd7Bh9YHjr5btssZcEXvSvvgK1jMaXdmBWa
XvISAP0XTl+xK7gZK1/PbLLB2TLsZD+d5iaGbU8BcTI2J46nBLg4BGdoxpESCisG
AQQBl1UBBQEBB0CGzmBJdAtHn3wAZ/xZK/j7S+rhQq3SR64VinKsyK5nYAMBCAeI
fgQYFgoAJhYhBJzQ1uinmTiRYDRrO0tMhS52bLrQBQJnaMaRAhsMBQkFo5qAAAoJ
EEtMhS52bLrQAekA/0aqlEvxiOQuyGJIzFVGcPOpREUr0N+uoVTMtCnhGrEDAQDp
60JDuIzOQTJrBzKTjk1VS+Ca5EGaH2QCkd2Uw+GmBA==
=on6z
-----END PGP PUBLIC KEY BLOCK-----
`,
    'Guestbook.txt': 'This is the content of the Guestbook.txt file.',
    'Hix.txt': 'THIS KID IS A NIGGER AND A SKID',
    'Ghouls.txt': 'THIS KID IS A NIGGER AND A SKID',
    'BTC.txt': '34xp4vRoCGJym3xR7yCVPFHoCNxv4Twseo',
    'XMR.txt': '42eiTEphhiUZDQM577s7bdNgj9X4auUPnRG4Xh74aqNZfQtLfeVuS1dStqtqMuqg6XCd8qPmyQKXtXyGcub3DzkXDUvSkb7',
    'ETH.txt': '0x00000000219ab540356cbb839cbe05303d7705fa',
};

let draggedTxtWindow = null;

function openTxtFile(fileName) {
    if (document.getElementById(`window-${fileName}`)) {
        return;
    }

    const txtWindow = document.createElement('div');
    txtWindow.id = `window-${fileName}`;
    txtWindow.classList.add('txt-window');

    const txtHeader = document.createElement('div');
    txtHeader.innerHTML = `<strong>${fileName} - Notepad</strong> <button onclick="closeTxtFile('${fileName}')">X</button>`;
    txtHeader.classList.add('txt-header');

    txtHeader.addEventListener('mousedown', function(event) {
        draggedTxtWindow = txtWindow;
        const rect = txtWindow.getBoundingClientRect();
        offsetX = event.clientX - rect.left; 
        offsetY = event.clientY - rect.top;  

        document.addEventListener('mousemove', dragTxtWindow);
        document.addEventListener('mouseup', stopDraggingTxtWindow);
    });

    txtWindow.appendChild(txtHeader);

    const txtBody = document.createElement('textarea');
    txtBody.value = fileContents[fileName]; 
    txtBody.classList.add('txt-body');
    txtWindow.appendChild(txtBody);

    const resizableArrow = document.createElement('div');
    resizableArrow.classList.add('resizable-arrow');
    resizableArrow.innerHTML = 'â†˜';
    txtWindow.appendChild(resizableArrow);

    const resizers = [
        'top', 'right', 'bottom', 'left',
        'top-left', 'top-right', 'bottom-left', 'bottom-right'
    ];
    resizers.forEach(position => {
        const resizer = document.createElement('div');
        resizer.classList.add('resizer', position);
        txtWindow.appendChild(resizer);
    });

    document.body.appendChild(txtWindow);

    enableResizing(`window-${fileName}`);
}

function dragTxtWindow(event) {
    if (draggedTxtWindow) {
        draggedTxtWindow.style.position = 'absolute'; 
        let newX = event.clientX - offsetX; 
        let newY = event.clientY - offsetY;

        if (newX < 0) newX = 0;
        if (newY < 0) newY = 0;
        if (newX + draggedTxtWindow.offsetWidth > window.innerWidth) 
            newX = window.innerWidth - draggedTxtWindow.offsetWidth;
        if (newY + draggedTxtWindow.offsetHeight > window.innerHeight) 
            newY = window.innerHeight - draggedTxtWindow.offsetHeight;

        draggedTxtWindow.style.left = newX + 'px';
        draggedTxtWindow.style.top = newY + 'px';
    }
}

function stopDraggingTxtWindow() {
    document.removeEventListener('mousemove', dragTxtWindow);
    document.removeEventListener('mouseup', stopDraggingTxtWindow);
    draggedTxtWindow = null; 
}

function closeTxtFile(fileName) {
    const txtWindow = document.getElementById(`window-${fileName}`);
    if (txtWindow) {
        txtWindow.remove();
    }
}


function stopResizing() {
    document.removeEventListener('mousemove', resizeFolder);
    document.removeEventListener('mouseup', stopResizing);
    isResizing = false;
}
