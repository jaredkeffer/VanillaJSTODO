let DATA = [];
let dataPrinter = document.getElementById('dataPrinter');
Glow(dataPrinter);
let allPages = [];

InitializeData();
window.onload = function () {
    window.scrollTo(0, 0);
}

dataPrinter.addEventListener('click', function(){
    Save();
});

pageContainer = document.getElementById('pageContainer');
pageButton = document.getElementById('newPage');
pageButton.addEventListener('click', createPage);
Glow(pageButton);
deletePageButton = document.getElementById('pageDeleteButton');
deletePageButton.addEventListener('click', function(){
    console.log(getTotalPages().length);
    if (getTotalPages().length >= 2) {
        let closestPage = getTotalPages()[getClosestPage()];
        closestPage.remove();
    }
});

let menuOpen = false;
let mainMenu = document.getElementById('mainMenu');
let settingsGear = document.getElementById('settingsGear');
settingsGear.draggable = false;
settingsGear.addEventListener('click', function(){
    if (menuOpen === false) {
        menuOpen = true;
        openMenu(mainMenu);
        settingsGear.classList.remove('rotateRight');
        settingsGear.classList.add('rotateLeft');
    } else if (menuOpen === true) {
        menuOpen = false;
        closeMenu(mainMenu);
        settingsGear.classList.remove('rotateLeft');
        settingsGear.classList.add('rotateRight');
    }
});

autoLockScroll();

function createPage() {
    let page = document.createElement('div');
    page.classList.add('page');

    let newCardButton = document.createElement('div');
    newCardButton.classList.add('button');
    newCardButton.classList.add('pageButton');
    Glow(newCardButton);

    let newCardText = document.createTextNode('+');
    newCardButton.appendChild(newCardText);

    page.appendChild(newCardButton);
    
    pageContainer.appendChild(page);
    newCardButton.addEventListener('click', function() {
        let newCard = createCard(page);
        createItem(newCard, '');
    });
    newCardButton.addEventListener('mousedown', function(){
        newCardButton.classList.add('.buttonActive');
    });
    nextPage();
    return page;
}

function createCard(_page) {
    let card = document.createElement('div');
    card.classList.add('card');

    let newItemButton = document.createElement('div');
    newItemButton.classList.add('button');
    newItemButton.classList.add('cardButton');
    Glow(newItemButton);
    
    let newItemText = document.createTextNode('+');
    newItemButton.appendChild(newItemText);
    card.appendChild(newItemButton);
    _page.appendChild(card);
    
    newItemButton.addEventListener('click', function() {
        createItem(card, '');
    });
    // dragElement(card);
    return card;
}

function createItem(_card, _text) {
    let itemText = _text;

    let item = document.createElement('div');
    item.classList.add('item');

    let itemInput = document.createElement('div');
    itemInput.classList.add('input');
    itemInput.innerText = itemText;
    item.appendChild(itemInput);
    _card.appendChild(item);

    itemInput.setAttribute('contentEditable', 'true');
    itemInput.setAttribute('onChange', 'changeItemText');
    itemInput.setAttribute('spellcheck', 'false');

    itemInput.addEventListener('input', function() {
        itemText = itemInput.innerText;
    });    
    let deleteButton = createDeleteButton(item);
    deleteButton.classList.add('itemButton');
    itemInput.focus();
    
    item.addEventListener("keydown", function(event) {
        if (!event.shiftKey && event.keyCode == 9) {
            if (item.parentElement.lastChild === item) {
                event.preventDefault();
                createItem(_card, '');
                item.parentElement.lastChild.focus();
            }
        }
        
    });
    return itemInput;
}

function createDeleteButton(_parent) {
    let deleteButton = document.createElement('div');
    deleteButton.classList.add('deleteButton');
    deleteButton.classList.add('button');

    _parent.appendChild(deleteButton);

    deleteButton.addEventListener('click', function(){
        if (_parent.parentElement.classList.contains('card')) {
            console.log(Array.from(_parent.parentElement.getElementsByClassName('item')).length);
            if (Array.from(_parent.parentElement.getElementsByClassName('item')).length <= 1) {
                _parent.parentElement.remove();
            }
        }
        _parent.remove();
    });
    _parent.addEventListener('mouseenter', function(){
        deleteButton.classList.add('showDelete');
    });
    _parent.addEventListener('mouseleave', function(){
        deleteButton.classList.remove('showDelete');
    });
    Glow(deleteButton);
    return deleteButton;
}

function Save() {
    DATA = [];
    let PAGES = [];
    let pages = Array.from(document.getElementsByClassName('page'));
    pages.forEach(function(page) {
        let cards = Array.from(page.getElementsByClassName('card'));
        let CARDS = [];
        cards.forEach(function(card){
            let items = Array.from(card.getElementsByClassName('item'));
            let ITEMS = [];
            items.forEach(function(item){
                let itemContent = {text: item.childNodes[0].innerText};
                ITEMS.push(itemContent);
            });
            CARDS.push(ITEMS);
        });
        PAGES.push(CARDS);
    });
    DATA.push(PAGES);
    window.localStorage.setItem('DATA', JSON.stringify(DATA));
    console.log("Data Saved!");
}

function InitializeData() {
    let _DATA = JSON.parse(window.localStorage.getItem('DATA'));
    for (i = 0; i < _DATA[0].length; i++) {
        let _page = createPage();
        for (j = 0; j < _DATA[0][i].length; j++) {
            let _card = createCard(_page);
            for (k = 0; k < _DATA[0][i][j].length; k++) {
                let _text = _DATA[0][i][j][k].text;
                createItem(_card, _text);
            }
        }
    } 
}

function getTotalPages() {
    let _totalPages = Array.from(document.getElementsByClassName('page'));
    return _totalPages;
}

function Glow(element) {
    element.addEventListener('mousedown', function(){
        element.classList.add('buttonActive');
    });
    element.addEventListener('mouseup', function(){
        element.classList.remove('buttonActive');
    });
    element.addEventListener('mouseleave', function(){
        element.classList.remove('buttonActive');
    });
}

function openMenu(menu) {
    menu.classList.remove('closeMenu');
    menu.classList.remove('closeMenuInitial');
    menu.classList.add('openMenu');
}

function closeMenu(menu) {
    menu.classList.remove('openMenu');
    menu.classList.add('closeMenu');
}
function autoLockScroll() {
    let isScrolling;
    window.addEventListener('scroll', function ( event ) {
        window.clearTimeout( isScrolling );
        isScrolling = setTimeout(function() {
            scrollMagnet(0);
        }, 400);
    }, false);
}
function scrollMagnet() {
    window.scrollTo(0, getTotalPages()[getClosestPage()].offsetTop);
}
function getClosestPage() {
    let _pages = getTotalPages();    
    let _scrollPos = window.scrollY;
    let _closestPageIndex = 0;
    let _minDist = 100000;
    for (i = 0; i < _pages.length; i++) {
        let _currentPagePos = Math.abs(_pages[i].getBoundingClientRect().top);
        if (_currentPagePos < _minDist) {
            _minDist = _currentPagePos;
            _closestPageIndex = i;
        }
    }
    return _closestPageIndex;
}
function nextPage() {
    window.scrollTo(0, getTotalPages()[getTotalPages().length - 1].offsetTop);
}

