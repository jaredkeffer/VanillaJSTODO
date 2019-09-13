let DATA = [];
let dataPrinter = document.getElementById('dataPrinter');
Glow(dataPrinter);
let allPages = [];
let maxCards = 10;
let backgroundColor = '';
// backgroundColor = ' linear-gradient(90deg, rgba(148,187,233,1) 0%, rgba(238,174,202,1) 100%);'
let gradientInput = document.getElementById('backgroundInputText');
gradientInput.innerText = backgroundColor;
gradientInput.addEventListener('keydown', function(event){
    if (event.keyCode == 13) {
        event.preventDefault();
        setBackground(gradientInput.innerText);
        Save();
    }
});
function setBackground(color) {
    let background = document.getElementById('background');
    background.style = 'background: '+ color;
    console.log(background.style.background);
    gradientInput.innerText = color;
}


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
    let cardContainer = document.createElement('div');
    cardContainer.classList.add('cardContainer');

    let newCardButton = document.createElement('div');
    newCardButton.classList.add('button');
    newCardButton.classList.add('pageButton');
    Glow(newCardButton);

    let newCardText = document.createTextNode('+');
    newCardButton.appendChild(newCardText);

    page.appendChild(cardContainer);
    page.appendChild(newCardButton);
    
    pageContainer.appendChild(page);
    newCardButton.addEventListener('click', function() {
        if (cardContainer.childNodes.length < maxCards) {
            let newCard = createCard(cardContainer);
            let title = createItem(newCard, '');
            title.classList.add('cardTitle');
        } else {
            console.log(cardContainer.childNodes.length);
        }
    });
    newCardButton.addEventListener('mousedown', function(){
        newCardButton.classList.add('.buttonActive');
    });
    nextPage();
    return cardContainer;
}

function createCard(_cardContainer) {
    let card = document.createElement('div');
    card.classList.add('card');

    let newItemButton = document.createElement('div');
    newItemButton.classList.add('button');
    newItemButton.classList.add('cardButton');
    Glow(newItemButton);
    
    let newItemText = document.createTextNode('+');
    newItemButton.appendChild(newItemText);
    card.appendChild(newItemButton);
    _cardContainer.appendChild(card);
    
    newItemButton.addEventListener('click', function() {
        createItem(card, '');
    });
    return card;
}

function createItem(_card, _text) {
    let itemText = _text;

    let item = document.createElement('div');
    item.classList.add('item');

    let itemInput = document.createElement('div');
    itemInput.classList.add('input');
    if (_card.childNodes.length > 1) {
        itemInput.classList.add('cardItem');
    }
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
            if (_parent.childNodes[0].classList.contains('cardTitle')) {
                _parent.parentElement.remove();
            }
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
    DATA = {contents: [], background: ''};
    let background = gradientInput.innerText;
    DATA.background = background;
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
    DATA.contents.push(PAGES);
    window.localStorage.setItem('DATA', JSON.stringify(DATA));
    console.log("Data Saved!");
    console.log(DATA);
}

function InitializeData() {
    let _DATA = JSON.parse(window.localStorage.getItem('DATA'));
    console.log(_DATA);
    backgroundColor = _DATA.background;
    setBackground(backgroundColor);
    for (i = 0; i < _DATA.contents[0].length; i++) {
        let _cardContainer = createPage();
        for (j = 0; j < _DATA.contents[0][i].length; j++) {
            let _card = createCard(_cardContainer);
            for (k = 0; k < _DATA.contents[0][i][j].length; k++) {
                if (k === 0) {
                    let _text = _DATA.contents[0][i][j][k].text;
                    let _cardTitle = createItem(_card, _text);
                    _cardTitle.classList.add('cardTitle');
                } else {
                    let _text = _DATA.contents[0][i][j][k].text;
                    let _cardItem = createItem(_card, _text);
                    _cardItem.classList.add('cardItem');
                }
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

