var Shuffle = window.Shuffle;
var gridContainerElement = document.getElementById('grid');
var entryNumber = 0;

class Demo {
  constructor(element) {
    this.element = element;
    this.shuffle = new Shuffle(element, {
      itemSelector: '.picture-item',
      sizer: element.querySelector('.my-sizer-element'),
    });

    // Log events.
    this.addShuffleEventListeners();
    this._activeFilters = [];
    this.addFilterButtons();
    this.addSorting();
    this.addSearchFilter();
  }

  /**
   * Shuffle uses the CustomEvent constructor to dispatch events. You can listen
   * for them like you normally would (with jQuery for example).
   */
  addShuffleEventListeners() {
    this.shuffle.on(Shuffle.EventType.LAYOUT, (data) => {
      console.log('layout. data:', data);
    });
    this.shuffle.on(Shuffle.EventType.REMOVED, (data) => {
      console.log('removed. data:', data);
    });
  }

  addFilterButtons() {
    const options = document.querySelector('.filter-options');
    if (!options) {
      return;
    }
    
    const filterButtons = Array.from(options.children);
    const onClick = this._handleFilterClick.bind(this);
    filterButtons.forEach((button) => {
      button.addEventListener('click', onClick, false);
    });
  }

  _handleFilterClick(evt) {
    const btn = evt.currentTarget;
    const isActive = btn.classList.contains('active');
    const btnGroup = btn.getAttribute('data-group');
    
    this._removeActiveClassFromChildren(btn.parentNode);
    
    let filterGroup;
    if (isActive) {
      btn.classList.remove('active');
      filterGroup = Shuffle.ALL_ITEMS;
    } else {
      btn.classList.add('active');
      filterGroup = btnGroup;
    }
    
    this.shuffle.filter(filterGroup);
  }

  _removeActiveClassFromChildren(parent) {
    const { children } = parent;
    for (let i = children.length - 1; i >= 0; i--) {
      children[i].classList.remove('active');
    }
  }

  addSorting() {
    const buttonGroup = document.querySelector('.sort-options');
    if (!buttonGroup) {
      return;
    }
    buttonGroup.addEventListener('change', this._handleSortChange.bind(this));
  }

  _handleSortChange(evt) {
    // Add and remove `active` class from buttons.
    const buttons = Array.from(evt.currentTarget.children);
    buttons.forEach((button) => {
      if (button.querySelector('input').value === evt.target.value) {
        button.classList.add('active');
      } else {
        button.classList.remove('active');
      }
    });
    
    // Create the sort options to give to Shuffle.
    const { value } = evt.target;
    let options = {};
    
    function sortByDate(element) {
      return element.getAttribute('data-created');
    }
    
    function sortByTitle(element) {
      return element.getAttribute('data-title').toLowerCase();
    }
    
    if (value === 'date-created') {
      options = {
        reverse: true,
        by: sortByDate,
      };
    } else if (value === 'title') {
      options = {
        by: sortByTitle,
      };
    }
    this.shuffle.sort(options);
  }

  // Advanced filtering
  addSearchFilter() {
    const searchInput = document.querySelector('.js-shuffle-search');
    if (!searchInput) {
      return;
    }
    searchInput.addEventListener('keyup', this._handleSearchKeyup.bind(this));
  }

  /**
   * Filter the shuffle instance by items with a title that matches the search input.
   * @param {Event} evt Event object.
   */
  _handleSearchKeyup(evt) {
    const searchText = evt.target.value.toLowerCase();
    this.shuffle.filter((element, shuffle) => {
      // If there is a current filter applied, ignore elements that don't match it.
      if (shuffle.group !== Shuffle.ALL_ITEMS) {
        // Get the item's groups.
        const groups = JSON.parse(element.getAttribute('data-groups'));
        const isElementInCurrentGroup = groups.indexOf(shuffle.group) !== -1;
        // Only search elements in the current group
        if (!isElementInCurrentGroup) {
          return false;
        }
      }
      const titleElement = element.querySelector('.picture-item__title');
      const titleText = titleElement.textContent.toLowerCase().trim();
      const descriptionElement = element.querySelector('.picture-item__description');
      const descriptionText = descriptionElement ? descriptionElement.textContent.toLowerCase().trim() : null ;
      const locationElement = element.querySelector('.picture-item__location');
      const locationText = locationElement ? locationElement.textContent.toLowerCase().trim(): null;
      const contactElement = element.querySelector('.picture-item__contact');
      const contactText = contactElement ? contactElement.textContent.toLowerCase().trim(): null ;
      const combinedText = titleText + descriptionText + locationText + contactText;
      return combinedText.indexOf(searchText) !== -1;
    });
  }
}

  
 /**
 * Convert an object to HTML markup for an item.
 * @param {object} dataForSingleItem Data object.
 * @return {string}
 */
function getMarkupFromData(dataForSingleItem) {
  var title = dataForSingleItem[0];
  var location = dataForSingleItem[1];
  var description = dataForSingleItem[2];
  var tags = dataForSingleItem[3];
  var contact = dataForSingleItem[4];
  var link = dataForSingleItem[5];
  var image = dataForSingleItem[6];
  var dateCreated = dataForSingleItem[7];
  var validated = dataForSingleItem[8];
  var tagsArray = tags.split(',');
  var singleQuote = '&#39;';
  
  var tagsList = tagsArray.map(n => "'" + n + "'");
  
  entryNumber++;
    
  if (validated !== 'Yes') {
    return null;
  }
    else {
      return [  
      '<figure class="col-3@xs col-4@sm col-4@md picture-item" data-groups="[' + tagsList + ']" ',
      'data-date-created="' + dateCreated + '" ',
      'data-title="' + title +'">',
      '<div class="picture-item__inner">',
      '  <div class="aspect aspect--16x9" onClick="toggledisplay(\'picture-item_descriptionbox-' + entryNumber + '\')">',
      '    <div class="aspect__inner">',
      '      <img src="' + image + '" />',
      '    </div>',
      '  </div>',
      '  <div class="picture-item__details">',
      '    <figcaption class="picture-item__title"><a href="' + link + '" target="_blank" rel="noopener">' + title + '</a></figcaption>',
      '    <p class="picture-item__tags hidden@xs">' + tags + '</p>',
      '  </div>',
      ' </div>',
      '<div id="picture-item_descriptionbox-' + entryNumber + '" class="picture-item__descriptionbox" style="display: none;" onClick="toggledisplay(\'picture-item_descriptionbox-' + entryNumber + '\')">',
      '  <div class="back"></div>',
      '  <span class="picture-item__description">' + description + '</span>',
      '  <span class="picture-item__location">Location: ' + location + '</span>',
      '  <span class="picture-item__contact">Contact: ' + contact + '</span>',
      '</div>',
    '</figure>',
  ].join('');
    }
}
/**
 * Convert an array of item objects to HTML markup.
 * @param {object[]} items Items array.
 * @return {string}
 */
function getItemMarkup(items) {  
  return items.reduce(function (str, item) {
    return str + getMarkupFromData(item);
  }, '');
}
/**
 * Append HTML markup to the main Shuffle element.
 * @param {string} markup A string of HTML.
 */
function appendMarkupToPage(markup) {
  var addNewOpportunities = [
      '<figure class="col-3@xs col-4@sm col-4@md picture-item shuffle-item shuffle-item--visible" data-groups="[\'all\']" data-date-created="2025-08-27" data-title="Add your own new opportunity here!">',
      ' <div class="picture-item__inner" style="background: #d18479;">  <div class="aspect aspect--16x9" onclick="javascript:location.href=\'https://docs.google.com/forms/d/e/1FAIpQLSenmOfUkMvHnYGsMQaDv0uqz9RLcIQO8o4KHkc1EXIZ04pVWQ/viewform\'">',    
      ' <div class="aspect__inner">      <img src="./img/icon-heads.png"> ',   
      '  </div> ', 
      '  </div> ',
      '  <div class="picture-item__details"  style="text-align: center;"> ',   
      '  <figcaption class="picture-item__title"><a href="https://docs.google.com/forms/d/e/1FAIpQLSenmOfUkMvHnYGsMQaDv0uqz9RLcIQO8o4KHkc1EXIZ04pVWQ/viewform" target="_blank" rel="noopener" style="font-style: italic; font-style: bold; color: #ffffff;">Share your own new opportunity here!</a> ',
      '  </figcaption> ',
    '</figure>',
        ].join('\n');
  
  markup = addNewOpportunities.toString() + markup;

  gridContainerElement.insertAdjacentHTML('afterbegin', markup);
}
 
/**
 * Enable click on entry to toggle additional description elements.
 * 
 */
function toggledisplay(elementID)
{
    (function(style) {
        style.display = style.display === 'none' ? 'block' : 'none';
    })(document.getElementById(elementID).style);
}

document.addEventListener('DOMContentLoaded', () => {
  fetch('https://sheets.googleapis.com/v4/spreadsheets/18k4CtZVn7rW52OVQxI_VZ_wanX9wE8TFnJJ1EGhoL3A/values/A2:I?key=AIzaSyAyaLHCMTHV4hrKpnj0r54fi_iucvTbYwU')
  .then(function (response) {
      return response.json();
  })
  .then(function (response) {
      // Create and insert the markup.
     var markup = getItemMarkup(response.values);
     appendMarkupToPage(markup);
    
     window.demo = new Demo(document.getElementById('grid'));
    
     //newHeightInPx = 200;
     //gridContainerElement.style.height = newHeightInPx + 'px';
      //alert(gridContainerElement.offsetHeight);
  });
  
  //window.demo = new Demo(document.getElementById('grid'));
});
