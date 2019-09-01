var Shuffle = window.Shuffle;
var gridContainerElement = document.getElementById('grid');

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
      return titleText.indexOf(searchText) !== -1;
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
  var link = dataForSingleItem[4];
  var image = dataForSingleItem[5];
  var dateCreated = dataForSingleItem[6];
  var validated = dataForSingleItem[7];
  
  return [  
      '<figure class="col-3@xs col-4@sm col-3@md picture-item" data-groups=\'["' + tags + ']\' ',
      'data-date-created="' + dateCreated + '" ',
      'data-title="' + title +'">',
      '<div class="picture-item__inner">',
      '  <div class="aspect aspect--16x9">',
      '    <div class="aspect__inner">',
      '      <img src="' + image + '" />',
      '    </div>',
      '  </div>',
      '  <div class="picture-item__details">',
      '    <figcaption class="picture-item__title"><a href="' + image + '" target="_blank" rel="noopener">' + title + '</a></figcaption>',
      '    <p class="picture-item__tags hidden@xs">' + tags + '</p>',
      '  </div>',
      ' </div>',
    '</figure>',
  ].join('');
  
}
/**
 * Convert an array of item objects to HTML markup.
 * @param {object[]} items Items array.
 * @return {string}
 */
function getItemMarkup(items) {
  //items.foreach(getMarkupFromData)
  return items.reduce(function (str, item) {
    return str + getMarkupFromData(item);
  }, '');
}
/**
 * Append HTML markup to the main Shuffle element.
 * @param {string} markup A string of HTML.
 */
function appendMarkupToPage(markup) {
  gridContainerElement.insertAdjacentHTML('beforeend', markup);
}
  
document.addEventListener('DOMContentLoaded', () => {
  fetch('https://sheets.googleapis.com/v4/spreadsheets/18k4CtZVn7rW52OVQxI_VZ_wanX9wE8TFnJJ1EGhoL3A/values/A2:H?key=AIzaSyAyaLHCMTHV4hrKpnj0r54fi_iucvTbYwU')
  .then(function (response) {
      return response.json();
  })
  .then(function (response) {
      // Create and insert the markup.
      var markup = getItemMarkup(response.values);
      appendMarkupToPage(markup);
    });
  
  window.demo = new Demo(document.getElementById('grid'));
});
