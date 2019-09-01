var pageLocation = document.getElementById('grid');  
  
fetch('https://sheets.googleapis.com/v4/spreadsheets/18k4CtZVn7rW52OVQxI_VZ_wanX9wE8TFnJJ1EGhoL3A/values/A2:H?key=AIzaSyAyaLHCMTHV4hrKpnj0r54fi_iucvTbYwU')
  .then(function (response) {
      return response.json();
  })
  .then(function (response) {
      // Create and insert the markup.
      var markup = getItemMarkup(response.values);
      appendMarkupToPage(markup);
    });
  
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
  //document.body.innerHTML += markup; 
  // test
  pageLocation.insertAdjacentHTML('beforeend', markup);
}
  
  
