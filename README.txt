 project Properties

 1. Created JSON data with properties and array field 'availability'.
 2. When the page is loaded, JS code starts to fetch JSON from server mocky.io or from local file , if 
   first way will be failed, used async/await construction.
 3. Address from loaded data used for retrieving of the GPS coordinates for the current property (Property for sale).
 4. Initialization of GoogleMaps navigation.
 5. Render another property's fields on the page, Name - used as src of the image.
 6. Use navigation buttons prev/next for changing of current property.
 7. Formatting of some fields with commas.
 8. When active/current property changed, function renderAvailabilities removes all the rows from 
   the tablebody and appends rows with another data.

used libraries: bootstrap, fontawesome, jQuery


local file "js/properties.json"
JSON URL   www.mocky.io/v2/5b3461e43200004c00d1e396
