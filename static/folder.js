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
Comment: User-ID:    obey
Comment: Valid from: 06/05/2024 23:46
Comment: Valid until: 06/05/2027 12:00
Comment: Type:       255-bit EdDSA (secret key available)
Comment: Usage:      Signing, Encryption, Certifying User-IDs
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
    'RageQuill.txt': ' 
 
                                                                  ──────────────────────────────────────────────────────────────────────────
                                                                  ▓│                ...::[ SCROLL DOWN TO VIEW PASTE ]::...               │▓   
                                                                  ▓│──────────────────────────────────────────────────────────────────────│▓
                                                                  ──────┘               ("Scroll down to view paste"):               └──────
                                                                    │             Telegram: https://t.me/richtofen77                         │
                                                                    │             Website:  https://deadshot.org                             │
                                                                    └──────────────────────────────────────────────────────────────────────┘

                           ╔═════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗
                           ║                                                                                                                                                 ║
                           ║                                                                                                                                                 ║     
                           ║                                                                                                                                                 ║
                           ║     8 888888888o.            .8.           ,o888888o.    8 8888888888       ,o888888o.     8 8888      88  8 8888 8 8888         8 8888         ║  
                           ║     8 8888    `88.          .888.         8888     `88.  8 8888          . 8888     `88.   8 8888      88  8 8888 8 8888         8 8888         ║ 
                           ║     8 8888     `88         :88888.     ,8 8888       `8. 8 8888         ,8 8888       `8b  8 8888      88  8 8888 8 8888         8 8888         ║ 
                           ║     8 8888     ,88        . `88888.    88 8888           8 8888         88 8888        `8b 8 8888      88  8 8888 8 8888         8 8888         ║ 
                           ║     8 8888.   ,88'       .8. `88888.   88 8888           8 888888888888 88 8888         88 8 8888      88  8 8888 8 8888         8 8888         ║ 
                           ║     8 888888888P'       .8`8. `88888.  88 8888           8 8888         88 8888     `8. 88 8 8888      88  8 8888 8 8888         8 8888         ║ 
                           ║     8 8888`8b          .8' `8. `88888. 88 8888   8888888 8 8888         88 8888      `8,8P 8 8888      88  8 8888 8 8888         8 8888         ║ 
                           ║     8 8888 `8b.       .8'   `8. `88888.`8 8888       .8' 8 8888         `8 8888       ;8P  ` 8888     ,8P  8 8888 8 8888         8 8888         ║ 
                           ║     8 8888   `8b.    .888888888. `88888.  8888     ,88'  8 8888          ` 8888     ,88'8.   8888   ,d8P   8 8888 8 8888         8 8888         ║ 
                           ║     8 8888     `88. .8'       `8. `88888.  `8888888P'    8 888888888888     `8888888P'  `8.   `Y88888P'    8 8888 8 888888888888 8 888888888888 ║ 
                           ║                                                                                                                                                 ║ 
                           ╠═════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╣
                           ║[0x00 - Table Of Contents - QUILLL ]▓░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░█[    ]║
                           ╠═════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╣
                           ║                                                                                                                                                 ║  
                           ║                                                         .-""-.                     .-""-.                                                       ║        
                           ║                                                      .'_.-.  |                   |  .-._'.                *                                     ║
                           ║                        *                            /    _/ /       _______       \ \_    \                         *                           ║                                                         
                           ║            *                                       /.--.' | |      `=======`      | | '.--.\                                                    ║
                           ║                                  *                /   .-`-| |       ,ooooo,       | |-`-.   \                                *                  ║           
                           ║                                                  ;.--':   | |     .d88888/8b.     | |   :'--.;                                            *     ║
                           ║                                                 |    _\.'-| |    d8888888/888b    | |-'./_    |                  *                              ║
                           ║     *                   *                         ;_.-'/:   | |   d8888P"`  'Y88b   | |   :\'-._;                                               ║
                           ║                                                 |   | _:-'\  \.d88(` ^ _ ^  )88b./  /'-:_ |   |                                   *             ║                        
                           ║                                 *               ;  .:` '._ \.d88888\   _   /88888b / _.' `:.  ;                                                 ║  
                           ║              *                                   |-` '-.;_ .d88888888b.___.d8888888b.` _;.-' `-|             *                                  ║
                           ║                                                 ; / .'\ | 888888888P'    'Y888888888b'| /'. \ ;                                 *               ║
                           ║                                                 | .' / `'.8888888P' `"---"` 'Y88888888'` \ '. |                     *                           ║
                           ║                *                                 ;/  /\_/-`Y888888|           |8888888P-\_/\  \;                                                ║
                           ║                           *            *         |.' .| `; Y88888| |       | |888888P;` |. '.|             *                                    ║
                           ║                                                  |  / \.'\_/Y8888| :--"""--: |8888P`_/'./ \  |                                            *     ║
                           ║       *                                           \| ; | ; |/8888| |   T   | |8888\| : | ; |/                             *                     ║
                           ║                                      *             \ | ; | /d8888\.'-.....-'./8888b\ | ; | /                                                    ║
                           ║                                                     `\ | |`d8888P' / ;|: | \ 'Y88888`| | /`                 *                                   ║
                           ║            *                                          .-:_/ Y8;=' .' / ' . : '. '888P`\_:'                                                      ║
                           ║                                                      |  \```      .'  ;     \    `:                                                             ║
                           ║                             *                          \  \                   '     `'.                  *                                 *    ║
                           ║               *                                     .--'\  |  '         '       .      `-._                             *                       ║      
                           ║                                                   /`;--' /_.'          .                  `-.                                         *         ║
                           ║       *                                            |  `--`        /               \           \              *                                  ║
                           ║                             *       *               \       .'   '                 '-.        |                                                 ║
                           ║                                                     \   '               '          __\       |                              *                   ║
                           ║            *                                          '.      .                 _.-'  `)     /         *                                        ║
                           ║                                                        '-._                _.-' `| .-`   _.'                                             *      ║
                           ║                       *       *                            `'--....____.--'|     (`  _.-'                               *       *               ║
                           ║                                                                     /  | |  \     `"`                                                           ║
                           ║                                    *                                \__/ \__/                               *                                   ║
                           ║                                                                                                     *                                           ║ 
                           ║                                                                                                                              *                  ║ 
                           ║     +       (`‾ ).                   _     *                 +         ._                 (`‾ ).       +    __,._                               ║
                           ║            (     ).     *        .:(`  )`.     +  ( )              .-(`  )        *      (     ).        (,.__ )       *     .')    * .-""""   *║ 
                           ║  +       _(       '`.       +  :(   .    )      (_.'   *       +  :(      ))           _(       '`.        ((_,))           (_  )    F   .-'    ║ 
                           ║       .=(`(      .   )     .--  `.  (    ) )  *   +        *   .-- `(    )  ))  +   .=(`(      .   )   +       ,,   ._              F   J  +    ║
                           ║      ((    (..__.:'-' + .+(   )   ` _`  ) )         .')     .+(   )` __.:'      _  ((    (..__.:'-'     .')     .-(`  ) *    +     I    I       ║    
                           ║`.    `(       ) )       (   .  )     (   )  ._  *  (_  )    (   .  )      +   (,..)`(       ) )    +   (_  )   :(      ))      _ *  L   `.   +  ║
                           ║  )     ` __.:'   )     (   (   ))     `-'.-(`  )           (   (   ))       (_.'   ) ` __.:'   )       (,.__ ) `(    )  ))    ( )    L    `-._, ║
                           ║)  ) ( )       --'       `- __.'         :(      ))          `- __.'           (''.)         --'                    ` __.:'  (_.' )    `-.__.-'  ║
                           ║.-' (_.'          .')             *      `(    )  ))   *   *         *                 *      *       *         *    *      *  *         *       ║
                           ║            *     (_  )                     ` __.:'                         +                            +            +       +             +    ║
                           ║           +     +                 +     +     *       *               *          *            *                    *           +             +  ║
                           ║         *                                                                                                                                       ║
                           ║                                           *                                                   Victim - Tanner                                   ║
                           ║                                                                      *                      ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾                                 ║
                           ║     *          '-.___```"""---.._                  *          ,                      / 0x00 / -->     Introduction......                        ║
                           ║                                   \                                                  / 1x01 / -->     Funny Moments.....                        ║
                           ║             ,-----.:___           `\  ,;;;,                                          / 1x02 / -->     Alias(es).........                        ║
                           ║                                       (%%%\                                          / 1x03 / -->     IRLs/Pictures.....                        ║
                           ║         *    '-.._     ```"""--.._  |,%%%%%%    *          _                         / 1x04 / -->     Personal Info.....                        ║
                           ║    *         ,    '.              `\;;;;  -\      _    _.'/\  *                      / 1x05 / -->     Social Media(s)...                        ║ 
                           ║       ,===/        ```";,,,,,,,;;;;;'`-./.____,'/ /     '.\/        *                / 1x06 / -->     Emails............                        ║
                           ║    '---/                            ,'`.        |            *                       / 1x07 / -->     Address History...                        ║
                           ║       ;\______,,.....------'''``.-'    \      ,'                                     / 1x08 / -->     Relatives.........                        ║
                           ║                                        |     /                                                                                                  ║
                           ║      *                            *     `---`                            *             Father -  Michael Isher                                  ║
                           ║             *                                    *                                   ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾                         ║
                           ║                     _..---.._                                                        / 2x01 / -->     IRLs/Pictures.....                        ║
                           ║   *               .' .-'''-. '.        *                        *                    / 2x02 / -->     Personal Info.....                        ║
                           ║       *   __    : :  /`;'   ) : :          _,="`\                      *             / 2x03 / -->     E-mails............                       ║
                           ║     ,--''`  ``'.; : |;   ,-;  : ;  __..==""==.,_|                                    / 2x04 / -->     Address History....                       ║
                           ║      `-,        `; .\;  / ^\ _,.="//                    *                            / 2x05 / -->     Court Report.......                       ║
                           ║         '-,_.--._ '.(;_.'__/`_.-'`\                                                                                                             ║
                           ║    ,.--''`` _..=. `'--.//   ``      \      *                    *                         Mother - Jennifer Lynn Fisher                         ║
                           ║    `--,   '`      `-  |_\ '-.       |                                                    ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾                        ║
                           ║  *     `-._         _.;--`-..___,.-'`                                                / 3x01 / -->     Personal Info.....                        ║
                           ║            `'-...-_:',;`==,| \                *                       *              / 3x02 / -->     Address History...                        ║
                           ║       *      _.--',=" /   /"=;="=,                                                                                                              ║
                           ║           _.'  ,=".-'`  .'  /| ,="                    *                      *                      *                                           ║
                           ║      _.--' .-' "=,     :  .' | ",                                 *                                                *                            ║
                           ║      `;._ .--'.'    .-' .' . ;        *                                                    *                                                    ║
                           ║      ,;;\_ .   '._.'--'` -' /                                                 *                          *                                      ║
                           ║        ,;;;._  '-._ .''.__.'                            *                                                          *                            ║
                           ║  *          `\_  .' '._   /                   *                                              *                                                  ║
                           ║                '._      .(`                                      *                                                                              ║
                           ║   *                                                                                                                                             ║
                           ║                                                                                          CREDITS --> Bottom of paste                            ║
                           ║             *                 *                      *               *                                                                          ║
                           ║                                                                                                                                                 ║
                           ╠═════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╣
                           ║[0x00 - Introduction - RageQuill ]▓░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░█[    ]║
                           ╠═════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╣  
                           ║                                                                                                                                                 ║
                           ║                                                             Commencement & Introduction                                                         ║
                           ║                                                            ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾                                                        ║
                           ║                                                                                                                                                 ║
                           ║ 								       Dear RageQuill,                                                               ║
                           ║			 Your over here pounding on why? just why make a dox on your fat ass, simple.                                                ║
                           ║		      It has come to my attention that you are getting quite TOO comfortable speaking with the words:                                ║ 
                           ║		 "I own everyone", "Everyone is my son" I think we need to clarify and put this in place, so rage with all these warnings            ║
                           ║		  you've gotten i think this Will be final, hopefully you will learn from this "warn" i guess you could say and change your ways.    ║
                           ║	    As this is a "warning" and i see no change in your self and the actions you have had this wont be the end of you little story            ║
                           ║			Now, lets talk about your claims;                                                                                            ║
                           ║                                                                                                                                                 ║
                           ║                                                                                                                                                 ║
                           ║ 		[1] > "I work with the FBI & Feds" This is just not true, at any extant this is not true not only that but you change your           ║
                           ║				story on this topic a lot its very clear to people who are not blind to your fantasy.                                ║
                           ║				And also where is you saying you can fed me and syskey? dont think thats                                             ║
                           ║				happening g, been waiting for a month now.                                                                           ║
                           ║                                                                                                                                                 ║
                           ║		[2] > "obey's Doxs are fake" Is this one fake Rage? or what? Well its obv that these dox's are not fake, if so then prove it plz.    ║
                           ║                                                                                                                                                 ║
                           ║		[3] > "I never leaked cp" This is shown to not be true as we have proof in the vault of pics and videos of you leaking octo          ║
                           ║				nudes also saiges, and i think some other women.                                                                     ║
                           ║                                                                                                                                                 ║
                           ║		[4] > "I Can swat" This is false as spookyk has said multi times rage "pays" him to swat which is not correct he doesen't get        ║
                           ║				paid, spooky also dont swat for rage and no swatting happens its just a bunch of lies.                               ║
                           ║                                                                                                                                                 ║
                           ║	    	[5] > "I own everyone", "Everyone is my son", this is false i dont need to say more.                                                 ║
                           ║                                                                                                                                                 ║
                           ║                                                                                                                                                 ║
                           ║ 			Talking at 14/09/2023;                                                                                                       ║
                           ║			[https://files.doxbin.gg/Lwya5mA5.mp4]: Talking to rage about the cp, "working with the FBI & Feds", "obey's Doxs            ║
                           ║			are fake", Seems to me that the cp situation hes touchy about but the other claims he seems not to give a fuck               ║
                           ║			about the other's.                                                                                                           ║ 
                           ║                                                                                                                                                 ║
                           ║			[https://files.doxbin.gg/0tBjgDEl.mp4]: Sec video him showing me spookys dms with rage, talking about his ego.               ║
                           ║                                                                                                                                                 ║
                           ║			15/09/2023;                                                                                                                  ║
                           ║			[https://files.doxbin.gg/3NCeRpyB.mp4]: SpookyK leaving vc after we "talk" about him and rage and the rage paying            ║
                           ║			for "swat's" from spooky.                                                                                                    ║
                           ║                                                                                                                                                 ║
                           ║                      Wednesday 6 Dec 2023; [Update]                                                                                             ║
                           ║                     He got kicked out of his mother's house and now lives with his father New address!                                          ║
                           ║                                                                                                                                                 ║
                           ║                                                                                                                                                 ║
                           ║	  							    RageQuill im sure you are not scared of death right?                             ║
                           ║								      I know some of your home boys, I said this again                               ║
                           ║									     "Everyone has a price" -obey                                            ║
                           ║                                                                                                                                                 ║
                           ║								    I'm sure your boys would like a price on your head no?                           ║
                           ║								    Blizzy:                                                                          ║
                           ║								    https://files.catbox.moe/liqoma.mov                                              ║
                           ║								    https://files.catbox.moe/y115yh.mov                                              ║
                           ║                                                                                                                                                 ║
                           ║  Enjoy the paste!                                                                                                                               ║
                           ║                                                                                                                                                 ║ 
                           ╠═════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╣
                           ║[1x01 - Funny moments - RageQuill ]▓░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░█[    ]║
                           ╠═════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╣  
                           ║                                                                                                                                                 ║
                           ║                              Shoot it you wont                               <->    https://files.catbox.moe/wc47hn.jpg                         ║
                           ║                              Sit your fat ass down                           <->    https://files.catbox.moe/zb7vri.jpg                         ║
                           ║                              Fishing are we?                                 <->    https://files.catbox.moe/41yzxa.jpg                         ║
                           ║                              Get da cig out ur mouth                         <->    https://files.catbox.moe/v2zn9k.jpg                         ║
                           ║                              Your not that guy bro                           <->    https://files.catbox.moe/yqt4sv.jpg                         ║
                           ║                              Your on crack or sm brotha                      <->    https://files.catbox.moe/8qpge5.jpg                         ║
                           ║                              Face Pic                                        <->    https://files.catbox.moe/4h4vld.jpg                         ║
                           ║                              Gang gang fr g?                                 <->    https://files.catbox.moe/lihmxs.jpg                         ║
                           ║                              Fuck you too you fat neck                       <->    https://files.catbox.moe/1xzhnm.jpg                         ║
                           ║                              Again, you will not shoot da                    <->    https://files.catbox.moe/dm7ith.jpg                         ║
                           ║                              Retard                                          <->    https://files.catbox.moe/hxffm1.jpg                         ║
                           ║                              Smoking that rage pack g                        <->    https://files.catbox.moe/y21eyb.mov                         ║
                           ║                              RAGEQUILL IS WATCHING                           <->    https://files.catbox.moe/nszek8.jpg                         ║
                           ║                              Dick riding                                     <->    https://files.catbox.moe/sp686v.PNG                         ║
                           ║                              begging for me to dox octo                      <->    https://files.catbox.moe/o36jgg.PNG                         ║
                           ║                              Begging me to dox syskey(give him fake info)    <->    https://files.catbox.moe/3rgebx.PNG                         ║
                           ║                              Paying for swating for me                       <->    https://files.catbox.moe/ygfrm7.PNG                         ║
                           ║                              OLD VIDEO me and jmx                            <->    https://files.catbox.moe/xqa6wb.mp4                         ║
                           ║                              Sending cp                                      <->    https://files.catbox.moe/4ajd0z.png                         ║
                           ║                              Old pic blocking                                <->    https://files.catbox.moe/es5d06.PNG                         ║
                           ║                              Needs help with his cp                          <->    https://files.catbox.moe/mus3cl.PNG                         ║
                           ║                              Sending Octos nudes                             <->    https://files.catbox.moe/3isr6b.png                         ║
                           ╠═════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╣
                           ║[1x02 - Aliases - RageQuill ]▓░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░█[    ]║
                           ╠═════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╣
                           ║                    » Alias(es):                                                                                                                 ║
                           ║                      ‾‾‾‾‾‾‾‾‾‾                                                                                                                 ║
                           ║                       - RageQuill                                                                                                               ║
                           ║                       - ragequillgaming                                                                                                         ║
                           ║                       - Bighippotanner                                                                                                          ║
                           ║                       - ItzNotRageQuill                                                                                                         ║
                           ╠═════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╣ 
                           ║[1x03 - IRLs / Picture(s) - Ragequill ]▓░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░█[    ]║
                           ╠═════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╣
                           ║                                                                                                                                                 ║
                           ║                              Bro.. you fr a fag    <->    https://files.catbox.moe/g5l7yg.jpg                                                   ║
                           ║                              You real e-hood       <->    https://files.catbox.moe/f3qpey.jpg                                                   ║
                           ║                              Standing up           <->    https://files.catbox.moe/0ed5wi.jpg                                                   ║
                           ║                              BaseBall OLD PIC      <->    https://files.catbox.moe/62zffj.jpg                                                   ║
                           ║                              Face Pic              <->    https://files.catbox.moe/a2tw71.jpg                                                   ║   
                           ╠═════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╣
                           ║[1x04 - Personal info - Ragequill ]▓░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░█[    ]║
                           ╠═════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╣    
                           ║                                                                                                                                                 ║
                           ║    » Full Name:          Tanner Joseph Fisher	                                                                                             ║
                           ║    » Age:                15                                                                                                                     ║
                           ║    » D.O.B:              01/3/2009 ─ MM/DD/YY                                                                                                   ║
                           ║    » Gender:             Male (M)                                                                                                               ║     
                           ║    » Race:               English                                                                                                                ║
                           ║    » Sexuality:          Straight                                                                                                               ║
                           ║    » Father:             Michael Isher                                                                                                          ║
                           ║    » Mother:             Jennifer Lynn Fisher                                                                                                   ║
                           ║                                                                                                                                                 ║
                           ║    » Phone:               (734) 756-5592                                                                                                        ║
                           ║                           │ Cell Info                                                                                                           ║
                           ║                           └──│ CELLCO PARTNERSHIP DBA VERIZON WIRELESS - MI                                                                     ║
                           ║                              │ Service Region: United States                                                                                    ║
                           ║                              │ Connection Status: Connected                                                                                     ║
                           ║                              │ Type: Wireless                                                                                                   ║
                           ║    » Address:             17, 9550 Spicer Rd, Brighton, MI 48116                                                                                ║  
                           ║                           │ Address Info                                                                                                        ║
                           ║                           └──│ Bedrooms: 1                                                                                                      ║                                             
                           ╠═════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╣
                           ║[1x05 - Social Media - Ragequill ]▓░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░█[    ]║ 
                           ╠═════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╣ 
                           ║                                                                                                                                                 ║
                           ║    » Youtube:            https://www.youtube.com/channel/UCSUG5eTD-UrzXpiNAYkxVVA?app=desktop                                                   ║
                           ║                          │ Youtube Info                                                                                                         ║
                           ║                          └──│ ID: ragequill7684                                                                                                 ║
                           ║                             │ Created: 26 Aug 2019                                                                                              ║
                           ║                             │ Channel Name: RaGe Quill                                                                                          ║
                           ║                                                                                                                                                 ║
                           ║    » Twitch:             https://www.twitch.tv/ragequill420                                                                                     ║ 
                           ║    » Snapchat:           b1gt500                                                                                                                ║
                           ║    » Xbox Info                                                                                                                                  ║
                           ║    » GamerTag: RaGe Quill                                                                                                                       ║
                           ║      │ IP Address: 71.64.196.77                                                                                                                 ║
                           ║      │ Org: Road Runner                                                                                                                         ║
                           ║      │ InternetProvider: Spectrum                                                                                                               ║
                           ║      │ Latitude: 39.342                                                                                                                         ║
                           ║      │ Longitude: -84.4068                                                                                                                      ║ 
                           ║      │ City: West Chester	                                                                                                                     ║
                           ║      │ Country: United States                                                                                                                   ║
                           ║      │ Continent: North America                                                                                                                 ║
                           ║      │ Region: Ohio                                                                                                                             ║
                           ║      │ District: Butler                                                                                                                         ║
                           ║      │ Timezone: America/New_York                                                                                                               ║
                           ║      │ Connection Type: Cable/DSL                                                                                                               ║
                           ║      │ ASN: AS10796 - Charter Communications Inc                                                                                                ║
                           ║      │ Currency: USD                                                                                                                            ║
                           ║      │ LinkIP: http://cpe-71-64-196-77.cinci.res.rr.com/                                                                                        ║
                           ║      │ GamerScore: 11,571                                                                                                                       ║
                           ║      │ GamesPlayed: 84                                                                                                                          ║
                           ║      │ Pfp: https://files.doxbin.gg/utR7zfex.webp                                                                                               ║
                           ║      │ Recent Game Clips:                                                                                                                       ║
                           ║      │ https://files.doxbin.gg/PMqtpYxI.mp4                                                                                                     ║
                           ║      │ https://files.doxbin.gg/HRhgQsU7.mp4                                                                                                     ║
                           ║      │ https://files.doxbin.gg/hJE96MN7.mp4                                                                                                     ║                                                                                                     
                           ║      │ https://files.doxbin.gg/NHMBWDG4.mp4                       		 				                                     ║
                           ║      │ Game History:                                                                                                                            ║
                           ║      │ Rainbow Six Siege > 	Last played 2 hours ago > 	95.0%                                                                        ║
                           ║      │ Rust Console Edition > 	Last played 23 hours ago > 	100.0%                                                                       ║
                           ║      │ Forza Horizon 5 > 		Last played 2 days ago > 	4.0%                                                                         ║
                           ║      │ Skate 3 > 			Last played 3 days ago > 	14.0%                                                                        ║ 
                           ║      │ Minecraft > 		Last played 1 week ago > 	40.0%                                                                        ║
                           ║      │ Stardew Valley > 		Last played 1 week ago > 	0%                                                                           ║
                           ║      │ DayZ > 			Last played 1 week ago > 	14.0%                                                                        ║
                           ║      │ Grand Theft Auto V > 	Last played 2 weeks ago > 	33.0%                                                                        ║
                           ║      │ Superliminal > 		Last played 2 weeks ago > 	0%                                                                           ║
                           ║      │ Need for Speed > 		Last played 2 weeks ago > 	0%                                                                           ║
                           ║      │ Forza Horizon 4 > 		Last played 2 weeks ago > 	8.0%                                                                         ║
                           ║      │ ROBLOX > 			Last played 2 weeks ago > 	100.0%                                                                       ║
                           ║      │ theHunter > 		Last played 1 month ago > 	23.0%                                                                        ║
                           ║      │ Fortnite > 		        Last played 2 months ago > 	49.0%                                                                        ║
                           ║      │ Descenders > 		Last played 3 months ago > 	27.0%                                                                        ║
                           ║      │ MXGP2 > 			Last played 4 months ago > 	7.0%                                                                         ║
                           ║      │ Clustertruck > 		Last played 6 months ago > 	2.0%                                                                         ║
                           ║      │ Overwatch2 > 		Last played 3 months ago > 	2.0%                                                                         ║
                           ║      │ Modern Warfare > 		Last played 5 months ago > 	11.0%                                                                        ║
                           ║      │ Far Cry5 > 		        Last played 6 months ago > 	3.0%                                                                         ║
                           ║      │ Apex Legends > 		Last played 6 months ago > 	52.0%                                                                        ║
                           ║      │ Sea of Thieves > 		Last played 11 months ago > 	6.0%                                                                         ║
                           ║      │ Gang Beasts > 		Last played 1 year ago > 	38.0%                                                                        ║  
                           ║    » Discord:            gh8p                                                                                                                   ║
                           ║                          │ Discord Info                                                                                                         ║
                           ║                          └──│ ID: 1135286783538647040                                                                                           ║
                           ║                             │ Created: Sun, 30 Jul 2023 19:04:21 UTC                                                                            ║
                           ║                             │ Banner: #00000                                                                                                    ║
                           ║                                                                                                                                                 ║
                           ║    » Spotify :           Username: tanfish08                                                                                                    ║
                           ║                          │ https://open.spotify.com/user/tanfish08                                                                              ║
                           ║                          └──│ Follower: https://open.spotify.com/user/sox0qymve4xdcjgffp388npr4?si=3002cfc3de6548b2                             ║
                           ║                             │ PublicPlayList : 5                                                                                                ║
                           ║                             │ https://open.spotify.com/playlist/1gOktqChX69N2ZQpUuvH0g?si=1769e6208e66486c                                      ║
                           ║                             │ https://open.spotify.com/playlist/1g0WCUpw0ZoIRtMivKDYgm?si=61e36f7e49ae4a79                                      ║
                           ║                             │ https://open.spotify.com/playlist/4isnVfW4xurE05SXLwcK61?si=4f03f4dc1dff45f1                                      ║
                           ║                             │ https://open.spotify.com/playlist/3JoQYpJE9EvimlYAQBSL8p?si=1fbff78294d74a6e                                      ║                                                                                                    
                           ║                                                                                                                                                 ║
                           ║    » Tiktok :        TikTok Info                                                                                                                ║    
                           ║                          │ ALT > ragequillgaming | Deleted After My First Dox.                                                                  ║
                           ║                          │ https://www.tiktok.com/@lzmajg?_t=8WlBY3NZGaL&_r=1#                                                                  ║
                           ║                          │ Displayname: ragequill                                                                                               ║
                           ║                          │ Username: ragequill                                                                                                  ║
                           ║                          │ ID: @ragequill                                                                                                       ║
                           ║                          │ Pfp: https://files.doxbin.gg/LH2xxmS2.jpeg                                                                           ║
                           ║                          │ Following: 2920                                                                                                      ║
                           ║                          │ Followers: 763                                                                                                       ║
                           ║                          │ Likes: 3935                                                                                                          ║
                           ║                          │ Link: https://www.tiktok.com/@ragequill                                                                              ║
                           ║                          │ Cringe Vids: 5                                                                                                       ║
                           ║                          │ https://www.tiktok.com/@ragequill/video/7273104654840466734                                                          ║
                           ║                          │ https://www.tiktok.com/@ragequill/video/7268172921225481518                                                          ║
                           ║                          │ https://www.tiktok.com/@ragequill/video/7121358870152514862                                                          ║
                           ║                          │ https://www.tiktok.com/@ragequill/video/7112468690506943786                                                          ║
                           ║                          │ https://www.tiktok.com/@ragequill/video/7115310384940207406                                                          ║
                           ║                                                                                                                                                 ║
                           ╠═════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╣
                           ║[1x06 - Email Addresses - Ragequill ]▓░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░█[    ]║
                           ╠═════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╣
                           ║                                                                                                                                                 ║
                           ║   › [1]:  jlfish886@gmail.com                                                                                                                   ║
                           ║           ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾                                                                                                                   ║
                           ║           »   [A]: Full Name: Jennifer Lynn Fisher                                                                                              ║  
                           ║           »   [A]: Location: US                                                                                                                 ║
                           ║           »   [A]: GUID: 108286572047830184306                                                                                                  ║
                           ║           »   [A]: Last Updated: 2023/07/06 05:37:57                                                                                            ║
                           ║           »   [A]: Site(s): adobe.com, apple.com, Youtube.com, Gravatar.com, bitmoji.com, change.org, flightaware.com, eventbrite.com,          ║
                           ║                             instacart.com, office365.com, paypal.com                                                                            ║
                           ║           »   [A]: Recovery: Password                                                                                                           ║ 
                           ║                             └──│ Database Leaks                                                                                                 ║
                           ║                                └──│ PW Logs                                                                                                     ║
                           ║                                   └──│ Password: txqrg5dq                                                                                       ║
                           ║                                      │ Password: Layilah08                                                                                      ║
                           ║                                      │ Password: Layila                                                                                         ║
                           ║                                      │ Password: c318b06a9e2286eabb66e87a5c3e17a5                                                               ║
                           ║                                                                                                                                                 ║ 
                           ║                                                                                                                                                 ║
                           ║   › [2]:  jennfish@umich.edu                                                                                                                    ║
                           ║           ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾                                                                                                                ║
                           ║           »   [B]: Full Name: Jennifer Lynn Fisher                                                                                              ║
                           ║           »   [B]: Location: US                                                                                                                 ║ 
                           ║           »   [B]: Site(s): Apple, Disneyplus, Quora, Google, Amazon, Instagram, Twitter, Myspace, Adobe, Pinterest, Netflix                    ║
                           ║           »   [B]: Recovery: Password                                                                                                           ║
                           ║                             └──│ Database Leaks                                                                                                 ║
                           ║                                └──│ PW Logs                                                                                                     ║
                           ║                                   └──│ Password: trouble10                                                                                      ║
                           ║                                      │ Password: bigmomma11	                                                                             ║
                           ║                                      │ Password: july07		                                                                             ║
                           ║                                      │ Last IP:  98.250.167.250                                                                                 ║
                           ║                                                                                                                                                 ║ 
                           ║                                                                                                                                                 ║  
                           ║                                                                                                                                                 ║
                           ║   › [3]:   eyox@yahoo.com                                                                                                                       ║
                           ║           ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾                                                                                                                ║
                           ║           »   [C]: Full Name: Jennifer Lynn Fisher                                                                                              ║
                           ║           »   [C]: Location: US                                                                                                                 ║ 
                           ║           »   [C]: Password: billabong!                                                                                                         ║
                           ╠═════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╣
                           ║[1x07 - Address History - Ragequill ]▓░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░█[    ]║
                           ╠═════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╣
                           ║                                                                                                                                                 ║
                           ║                                      ┌────────────────────────────────────────────────────────────────┐                                         ║  
                           ║                                      |                   Address                   │   Date Lived     │                                         ║  
                           ║                                      ├─────────────────────────────────────────────────────────────────                                         ║  
                           ║                                      |     813 W Hamburg St Pinckney, MI 48169     │     11/2022      │                                         ║
                           ║                                      └────────────────────────────────────────────────────────────────┘                                         ║ 
                           ║                                                                                                                                                 ║
                           ╠═════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╣
                           ║[1x08 - Relatives - Ragequill ]▓░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░█[    ]║
                           ╠═════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╣
                           ║                                                                                                                                                 ║
                           ║                                                ┌─────────────────────────────────────────┐                                                      ║  
                           ║                                                |           Name           |   D.O.B      |                                                      ║  
                           ║                                                ├─────────────────────────────────────────┤                                                      ║  
                           ║                                                | Jennifer Lynn Fisher     | July 1st 1976|                                                      ║  
                           ║                                                | Michael Shane Fisher     |  06/01/1972  |                                                      ║  
                           ║                                                | Tori FIsher              |  06/24/1993  |                                                      ║  
                           ║                                                | Steven Michael Fisher    |  07/08/1976  |                                                      ║  
                           ║                                                | Jerry Wade Poley         |  09/15/1949  |                                                      ║       
                           ║                                                └─────────────────────────────────────────┘                                                      ║
                           ║                                                                                                                                                 ║
                           ╠═════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╣ 
                           ║[2x01 - IRLs / Picture(s) - Father ]▓░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░█[    ]║
                           ╠═════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╣
                           ║                                                                                                                                                 ║
                           ║                            » Picture 01: https://files.catbox.moe/73i7ge.jpg      Picture 02: https://files.catbox.moe/w9zw1b.jpg               ║
                           ║                                                                                                                                                 ║ 
                           ╠═════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╣
                           ║[2x02 - Personal info - Father ]▓░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░█[    ]║ ‬
                           ╠═════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╣  
                           ║                                                                                                                                                 ║
                           ║    » Full Name:          Michael Shane Fisher                                                                                                   ║                                                        
                           ║    » Age:                51                                                                                                                     ║
                           ║    » D.O.B:              06/01/1972 ─ MM/DD/YY                                                                                                  ║
                           ║    » Gender:             Male (M)                                                                                                               ║     
                           ║                                                                                                                                                 ║ 
                           ║    » Phone:              (734) 878-9794 (landline)                                                                                              ║
                           ║    » Address:             9550 Spicer Rd, Brighton, MI 48116 (may of moved)                                                                     ║  
                           ║                           │ Address Info                                                                                                        ║
                           ║                           └──│ Bedrooms: 3                                                                                                      ║
                           ║                              │ Lot: 1.40 Acres                                                                                                  ║
                           ║                                                                                                                                                 ║
                           ╠═════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╣
                           ║[2x03 - E-mails - Father ]▓░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░█[    ]║
                           ╠═════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╣
                           ║                                                                                                                                                 ║
                           ║   › [1]:  msf6172@gmail.com                                                                                                                     ║
                           ║           ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾                                                                                                                 ║
                           ║           »   [A]: Full Name: Michael Fisher                                                                                                    ║
                           ║           »   [A]: Location: US                                                                                                                 ║ 
                           ║           »   [A]: GUID: 117582047494631481839                                                                                                  ║
                           ║           »   [A]: Last Updated: 2023/09/07 10:25:50                                                                                            ║
                           ║           »   [A]: Site(s): Apple, Netflix, Google, Samsung, Instagram, Twitter, Disneyplus                                                     ║
                           ║           »   [A]: Recovery: (•••) •••-••33                                                                                                     ║
                           ║           »   [A]: Database Leaks:                                                                                                              ║
                           ║                       └──│ Sources                                                                                                              ║
                           ║                          └──│ homechef.com_users_202002101319.csv                                                                               ║
                           ║                             │ usa_cell_db_2019.csv                                                                                              ║
                           ║                             │ www.nidink.com.txt                                                                                                ║
                           ║                             │ usa_cell_db_2019.rar/usa_cell_db_2019_3.csv                                                                       ║ 
                           ║                             │ www.nidink.com.txt [2]                                                                                            ║ 
                           ║                                                                                                                                                 ║
                           ║   › [2]:  jlfish886@gmail.com                                                                                                                   ║
                           ║           ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾                                                                                                               ║
                           ║           »   [B]: Full Name: Michael Fisher                                                                                                    ║
                           ║           »   [B]: Location: US                                                                                                                 ║ 
                           ║           »   [B]: GUID: 108286572047830184306                                                                                                  ║
                           ║           »   [B]: Last Updated: 2023/07/06 05:37:57                                                                                            ║
                           ║           »   [B]: Site(s): Apple, Google, Gravatar, Linkedin, Microsoft, Pinterest, Spotify, Twitter, Booking, Amazon, Adobe, Wordpress,       ║
                           ║                             Disneyplus, Netflix, Samsung, Quora                                                                                 ║
                           ║           »   [B]: Recovery: Password                                                                                                           ║
                           ║           »   [B]: Paswords: c318b06a9e2286eabb66e87a5c3e17a5 , Layila , Layilah08 , txqrg5dq                                                   ║ 
                           ║                                                                                                                                                 ║
                           ║   › [3]:  sarahjc5@yahoo.com                                                                                                                    ║
                           ║           ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾                                                                                                              ║
                           ║           »   [C]: Full Name: Michael Fisher                                                                                                    ║
                           ║           »   [C]: Location: US                                                                                                                 ║ 
                           ║           »   [C]: Site(s): Apple, Pinterest, Netflix, Google, Twitter, Patreon, Linkedin, Yahoo, Microsoft, Booking, Myspace, Amazon           ║
                           ║           »   [C]: passwords: jj1234 , Jj1234! , levelle1                                                                                       ║
                           ╠═════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╣
                           ║[2x04 - Address History - Father ]▓░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░█[    ]║
                           ╠═════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╣
                           ║                                                                                                                                                 ║
                           ║                              ┌─────────────────────────────────────────────────────────────────────────────────────┐                            ║  
                           ║                              |                   Address                   │   Date Lived     │      County        |                            ║  
                           ║                              ├─────────────────────────────────────────────────────────────────────────────────────┤                            ║
                           ║                              |   813 W Hamburg StPinckney, MI 48169        │   March of 2020  │   Livingston County|                            ║
                           ║                              |   14221 Dallas Pkwy STE 1000Dallas, TX 75254│   January of 2015│   Dallas County    |                            ║
                           ║                              |   3900 Wisconsin Ave NWWashington, DC 20016 │   January of 2014│   Columbia County  |                            ║
                           ║                              └─────────────────────────────────────────────────────────────────────────────────────┘                            ║ 
                           ║                                                                                                                                                 ║                                 
                           ╠═════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╣
                           ║[2x05 - Court report - /Father ]▓░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░█[    ]║
                           ╠═════+═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╣ 
                           ║     ├── LIMITED ACCESS SPEEDING 5 OVER LIMIT	                                                                                             ║
                           ║         ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾                                                                                                  ║
                           ║     ├── Date:                  	 6/7/2009                                                                                                    ║
                           ║     ├── Source Name: 		 LIMITED ACCESS SPEEDING 5 OVER LIMIT                                                                        ║
                           ║     ├── Case Number: 		 09JC33315A SI 12                                                                                            ║
                           ║     ├── Offense Date:  		 June 7, 2009                                                                                                ║
                           ║     ├── Disposition Date: 	         August 6, 2009                                                                                              ║  
                           ║     ├── Court:  		         District                                                                                                    ║
                           ║     ├── Disposition:  	 	 Judgment Rendered                                                                                           ║
                           ║     ├── Guilty: 		         False                                                                                                       ║
                           ║-------------------------------------------------------------------------------------------------------------------------------------------------║
                           ║     ├── Michigan Jackson 12th District Court	                                                                                             ║
                           ║         ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾                                                                                                  ║
                           ║     ├── Date:                  	 June 7, 2009                                                                                                ║
                           ║     ├── Source Name: 		 Michigan Jackson 12th District Court                                                                        ║
                           ║     ├── Case Number: 		 09JC33315C SI 12                                                                                            ║
                           ║     ├── Offense Date:  		 June 15, 2009                                                                                               ║
                           ║     ├── Disposition: 	         Judgment Rendered                                                                                           ║  
                           ║     ├── Court:  		         District                                                                                                    ║
                           ║     ├── Guilty: 		         False                                                                                                       ║
                           ║-------------------------------------------------------------------------------------------------------------------------------------------------║  
                           ║                                                                                                                                                 ║
                           ║     ├── Virginia Administrator Of The Courts District Courts	                                                                             ║    
                           ║         ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾                                                                                  ║
                           ║     ├── Date: 			3/23/2006                                                                                                    ║
                           ║     ├── Source Name: 		Virginia Administrator Of The Courts District Courts Website                                                 ║
                           ║     ├── Case Number: 		163GT06002774-00                                                                                             ║
                           ║     ├── Offense Date:		March 23, 2006                                                                                               ║
                           ║     ├── Charges Filed Date: 	March 23, 2006                                                                                               ║
                           ║     ├── Court: 			Rockbridge/lexington Combined                                                                                ║
                           ║     ├── Disposition: 		Guilty In Absentia                                                                                           ║
                           ║     ├── Guilty: 		        True                                                                                                         ║
                           ║     ├── Classification: 	        Infraction                                                                                                   ║
                           ║     ├── Offense Code: 		46.2-878.1                                                                                                   ║
                           ║     ├── Court Costs: 		$76.00                                                                                                       ║
                           ║     ├── Fines: 			$114.00                                                                                                      ║
                           ║-------------------------------------------------------------------------------------------------------------------------------------------------║
                           ║                                                                                                                                                 ║
                           ║     ├── Ohio Erie County Municipal Court                                                                                                        ║     
                           ║         ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾                                                                                                      ║
                           ║     ├── Date: 			October 23, 1992                                                                                             ║ 
                           ║     ├── Source Name: 		Ohio Erie County Municipal Court                                                                             ║
                           ║     ├── Offense Code:		4511.21D2                                                                                                    ║
                           ║     ├── Case Number: 		TRD9208687                                                                                                   ║
                           ║     ├── Offense Date: 		October 23, 1992                                                                                             ║
                           ║     ├── Charges Filed Date:        October 23, 1992                                                                                             ║
                           ║     ├── Court: 			Municipal                                                                                                    ║
                           ║     ├── Disposition: 		November 5, 1992                                                                                             ║
                           ║     ├── Guilty: 		        True                                                                                                         ║
                           ║     ├── Classification: 	        Traffic                                                                                                      ║
                           ║     ├── Offense Code: 		4511.21D2                                                                                                    ║
                           ║     ├── Court Costs: 		$40.00                                                                                                       ║ 
                           ║     ├── Fines: 			$20.00                                                                                                       ║
                           ║-------------------------------------------------------------------------------------------------------------------------------------------------║
                           ║                                                                                                                                                 ║
                           ║     ├── Unclaimed Funds                                                                                                                         ║
                           ║         ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾                                                                                                                        ║
                           ║     ├── Property Id: 		22642390                                                                                                     ║
                           ║     ├── Property Type: 		VENDOR CHECKS                                                                                                ║
                           ║     ├── Cash Reported: 		$237.33                                                                                                      ║
                           ║     ├── Shares Reported: 	        $0                                                                                                           ║
                           ║     ├── Owner Name: 		MICHAEL FISHER                                                                                               ║
                           ║     ├── Owner City: 		BRIGHTON                                                                                                     ║
                           ║     ├── Owner State: 		MI                                                                                                           ║
                           ║     ├── Holder Name: 		ALLIANCE HEALTH & LIFE INS CO                                                                                ║
                           ║-------------------------------------------------------------------------------------------------------------------------------------------------║
                           ╠═════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╣
                           ║[3x01 - Personal info - Mother ]▓░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░█[    ]║
                           ╠═════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╣   
                           ║                                                                                                                                                 ║
                           ║    » Full Name:          Jennifer Lynn Fisher                                                                                                   ║                                                        
                           ║    » Age:                47                                                                                                                     ║
                           ║    » D.O.B:              July 1st, 1976                                                                                                         ║
                           ║    » Gender:             Female (F)                                                                                                             ║                        
                           ║                                                                                                                                                 ║
                           ║    » Address:             6988 Mckean Rd LOT 249, Ypsilanti, MI 48197-6034                                                                      ║  
                           ║                           │ Address Info                                                                                                        ║
                           ║                           └──│ Bedrooms: 3                                                                                                      ║
                           ║                              │ Bathroom: 1                                                                                                      ║
                           ║                              │ Parcel:   K8836200249                                                                                            ║
                           ║                                                                                                                                                 ║
                           ╠═════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╣
                           ║[3x02 - Address History - Mother ]▓░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░█[    ]║
                           ╠═════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╣
                           ║                                                                                                                                                 ║
                           ║                              ┌─────────────────────────────────────────────────────────────────────────────────────┐                            ║  
                           ║                              |                   Address                   │   Date Lived     │      County        |                            ║  
                           ║                              ├─────────────────────────────────────────────────────────────────────────────────────┤                            ║
                           ║                              |   813 W Hamburg StPinckney, MI 48169        │  December of 2022│  Livingston County |                            ║
                           ║                              |  14221 Dallas Pkwy STE 1000 Dallas, TX 75254│  January of 2015 │   Dallas County    |                            ║
                           ║                              └─────────────────────────────────────────────────────────────────────────────────────┘                            ║ 
                           ║                                                                                                                                                 ║
                           ╠═════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╣  
                           ║[8x00 - Credits - Ragequill Doxed]▓░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░█[    ]║
                           ╠═════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╣
                           ║                                                                                                                                                 ║
                           ║     /             /                                       /    /     /======/     /       /             /      /                             /  ║
                           ║           /          /                   /        /                  | Rest |                                                                   ║ 
                           ║                                   /                         /        |  In  |                    /           /                  /               ║ 
                           ║            /              /                                          | Piss |         /                                /                 /      ║  
                           ║    /      /                                       /         /========'      '========/         /            /                                   ║ 
                           ║                      /              /                       |   _    RageQuill     _   |                                      /         /       ║
                           ║          /                                    /             |  /_;-/__ / _\  _/-;_\  |                /           /                             ║  
                           ║                                                             |     `-/_`'`_/'`/-'     |                                                        / ║   
                           ║               /           /         /                       '========/`\   /`========'    /         /          /                     /          ║  
                           ║                                               /        /             | |  / |                                           /                       ║
                           ║      /                             /                                 |/-/(  |     /                           /                                 ║
                           ║                 /                 /               /     /            |\_/_\ |                                         /      /            /     ║                  
                           ║                                          /                           | \ \`;|          /          /                                             ║  
                           ║         /             /                                              |  > |/|                              /              /                  /  ║
                           ║                                 /             /        /             | / // |   /                                                     /         ║              
                           ║          /     /                                               /     | |//  |                                               /                   ║      
                           ║                                     /                                | \(\  |                 /           /                                     ║               
                           ║                      /                      /         /              |  ``  |            /                          /    /                      ║  
                           ║       /                      /                                       |      |                                                       /         / ║                    
                           ║                                   /          /                       |      |                            /                                      ║
                           ║             /             /                        /        /        |      |     /         /                         /                         ║
                           ║             /                        /                               |      |                                                                   ║
                           ║                                                          \\_ , _  _\\| \//  |//_   _ \// _                                                      ║  
                           ║                                                         ^ `^`^ ^`` `^ ^` ``^^`  `^^` `^ `^                                                      ║ 
                           ║                                   ╔══════════════════════════════════════════════════════════════════════════════════════╗                      ║
                           ║                                   |      OBEY              <->  Entirety of the dox  <->  doxbin.com/user/obey           |                      ║
                           ║                                   |      TOBAYAS           <->         Format        <->  doxbin.com/user/Tobayas        |                      ║
                           ║                                   └──────────────────────────────────────────────────────────────────────────────────────┘                      ║
                           ╚═════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝ 
',
    'BTC.txt': 'bc1qfh5e3w7sgyxuz00v0p0eqc425la6zjt6n405vc',
    'XMR.txt': '45EaBDn5X8iQBTot3dWxVZjTj3on5fjR81zdErrndgfU8to4cZ4r4jveoKMpLcQxU8CKQL9dbxgsmjenboi8p1hpMuDJq3F',
    'ETH.txt': '0x2B896c89C3ac3c82bd7f58338816f2b644B310e1',
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
