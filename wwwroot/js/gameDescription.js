
var description = {
    'GameId': 'getgameid',
    'mainDescription' : '',
    'Features': new Map()
};
let testobj1 = {'Title': 'Singleplayer', 'Description': 'Singleplayer description'};
// let testobj2 = {'FeaturePoint': 'Multiplayer', 'FeatureDesc': 'Multiplayer description'};
description.Features.set('feature3', testobj1);
// description.Features.set('feature-2', testobj2);

var descriptionBody = document.getElementById('description-Body-Id');       
var imageInput = document.getElementById('image-input');
var imagePreviewArea = document.getElementById('image-preview-area-id');
var imagePreview = imagePreviewArea.querySelector('.image-preview');
var imagePreviewDefaultText = imagePreviewArea.querySelector('.image-preview-default-text');

var collapseArea = $('#collapse-TextArea-Id');
var addFeatureButton = document.getElementById('add-feature-button');
var addFeatureConfirmDiv = document.getElementById('confirm-feature');
var confirmCreationButton = document.getElementById('confirm-button-id');
var abortCreationButton = document.getElementById('abort-button-id');
var deleteFeatureDiv = document.getElementById('confirm-delete');
var deleteButton = document.getElementById('delete-button-id');
var cancelDeleteButton = document.getElementById('cancel-delete-button-id');
var myheading = document.getElementById('aboutheading');
var firstFeature = document.getElementById('first-feature');
var toggleElementsButton = document.getElementById('toggle-elements-button');
//for easy testing
document.getElementById('MyH1').addEventListener('click', ()=> {
    document.querySelector('.section').classList.toggle('collapse');
})

function CreateImageButtons()
{
    var buttonTypes = ['change', 'delete', 'swap'];
    var buttons = {};
    buttonTypes.forEach((val) => {
        let button = document.createElement('button');
        let buttonColor = document.createElement('div');
        let arrow = document.createElement('div');
        button.classList.add('image-buttons', `${val}-feature`)
        buttonColor.innerText = val;
        buttonColor.classList.add('image-button-color', `${val}-feature`);
        arrow.classList.add('my-arrow');
        button.appendChild(buttonColor);
        button.lastChild.appendChild(arrow);
        buttons[val] = button; 
    })
    return buttons;
}

function CreateButtonsWithoutImage()
{
    var buttonTypes = ['Delete', 'Swap', 'Upload'];
    var buttons = {};
    buttonTypes.forEach((val) => {
        // let tooltip = document.createElement('span');
        // let tooltipText = document.createElement('span');
        buttons[val] = document.createElement('span');
        buttons[val].appendChild(document.createElement('span'));
        buttons[val].firstChild.classList.add('tooltiptext');  
        buttons[val].firstChild.innerText = val;     
        // tooltip.classList.add('far fa-trash-alt fa-delete-tip mytooltip')
    })
    buttons.Delete.classList.add('far', 'fa-trash-alt', 'fa-delete-tip', 'mytooltip');
    buttons.Swap.classList.add('fas', 'fa-exchange-alt', 'fa-swap-tip', 'mytooltip');
    buttons.Upload.classList.add('far', 'fa-file-image', 'fa-upload-tip', 'mytooltip');
    return buttons;
}
//testing purpose
myheading.addEventListener('click', function() {CreateButtonsWithoutImage();});

var newFeature = (function()
{
    var getFeatureListLength = document.getElementById('feature-list').querySelectorAll('.temp').length;

    function CreateElement(featureObject)
    {
        getFeatureListLength++;
        var featureDiv = document.createElement('div');
        featureDiv.classList.add('temp');
        featureDiv.style.position = "relative";
        featureDiv.id = `feature-${getFeatureListLength}`;

        var Title = document.createElement('strong');
        Title.innerText = featureObject.Title;
        Title.classList.add('feature-description', 'title');
        var Description = document.createElement('p');
        Description.innerText = featureObject.Description;
        Description.classList.add('feature-description', 'description');

        var buttons = {};
        if (featureObject.Image != undefined) {
            //can be made nicer
            buttons = CreateImageButtons();
            for(var key of Object.keys(buttons)){ featureDiv.appendChild(buttons[key])}
            // let changeButton = CreateImageButtons('change');
            // let deleteButton = CreateImageButtons('delete');
            // let swapButton = CreateImageButtons('swap');
            // featureDiv.appendChild(changeButton);
            // featureDiv.appendChild(deleteButton);
            // featureDiv.appendChild(swapButton);
            let Image = document.createElement('img');
            Image.src = featureObject.Image;
            Image.classList.add('feature-img');
            featureDiv.appendChild(Image);
            featureDiv.appendChild(Title); 
        }else
        {
            //add new buttons without image
            featureDiv.appendChild(Title);
            buttons = CreateButtonsWithoutImage();
            for(var key of Object.keys(buttons)){ featureDiv.appendChild(buttons[key])}           
        }     
        featureDiv.appendChild(Description);
        return featureDiv;
    }
    return CreateElement;
})();

//DisplayConfirmBox and HideConfirmBox are pretty janky, should come back to this.
function DisplayConfirmBox(currentFeature, currentConfirmBox)
{
    descriptionBody.style.pointerEvents = 'none';
    if(currentConfirmBox == addFeatureConfirmDiv)
    {
        document.querySelectorAll(`.description-content > *:not(#${currentFeature.id})`).forEach(el => {el.style.filter = "blur(2px) grayscale(70%)";});
    }else
    {
        document.querySelectorAll(`.description-content > *:not(#feature-list)`).forEach(el => {el.style.filter = "blur(2px) grayscale(70%)";});
        document.querySelectorAll(`#feature-list > *:not(#${currentFeature.id})`).forEach(el => {el.style.filter = "blur(2px) grayscale(70%)";});
    }
    currentConfirmBox.style.display = 'block';
    currentConfirmBox.style.pointerEvents = 'auto';
}

function HideConfirmBox(currentConfirmBox)
{
    currentConfirmBox.style.display = 'none';
    descriptionBody.style.pointerEvents = 'auto';
    document.querySelectorAll('.description-content > *').forEach(el => {el.style.filter = "none";});
    if(currentConfirmBox != addFeatureConfirmDiv) 
    { 
        document.querySelectorAll(`#feature-list > *`).forEach(el => {el.style.filter = "none";});
    }
}

function CreateTextArea(innerText = 'Edit field', targetHeight)
{
    let newTextArea = document.createElement('textarea');
    newTextArea.classList.add("feature-description-edit");
    newTextArea.style.height = targetHeight + 50;
    newTextArea.value = innerText;
    return newTextArea;  
}

function CreateSaveButton()
{
    //can add styling later etc.
    let saveButton = document.createElement('button');
    saveButton.id = 'save-button';
    saveButton.innerText = 'Save';
    return saveButton; 
}

function CheckImageResolution({width, height})
{
    if(width > 600 || width < 400) return false;
    if(height > 400 || height < 150) return false;

    return true;
}

function UpdateFeature(featureKey, currentElement, newValue)
{
    //featureKey seems ok, i will generate real Id on backend
    if(currentElement.contains('feature-img'))
    {
        //update image
        description.Features.get(featureKey).Image = newValue;
    }else if(currentElement.contains('title'))
    {
        description.Features.get(featureKey).Title = newValue;              
    }else if(currentElement.contains('description'))
    {
        description.Features.get(featureKey).Description = newValue;
    }else if(currentElement.contains('main-description'))
    {
        description.mainDescription = newValue;
    }
    console.log(description.Features.entries());           
}

function DeleteFeature(ev)
{
    //ne treba mi novi confirmbox, imacu samo jedan i pomeracu ga svuda
    // var currentConfirm = newConfirmBox();
    var currentFeature = ev.target.closest('.temp');
    currentFeature.append(deleteFeatureDiv);

    DisplayConfirmBox(currentFeature, deleteFeatureDiv);
}

function ChangeDescription(ev)
{
    let currentElement = ev.target;
    let newTextArea = CreateTextArea(currentElement.innerText, ev.target.offsetHeight);
    let saveButton = CreateSaveButton();                               
    ev.target.replaceWith(newTextArea);
    newTextArea.insertAdjacentElement('afterend', saveButton);
    saveButton.addEventListener('click', function UpdateDescriptionObject()
    {                 
        UpdateFeature(newTextArea.parentElement.id, currentElement.classList, newTextArea.value);
        currentElement.innerText = newTextArea.value;
        newTextArea.replaceWith(currentElement);
        saveButton.remove();
    });
}

function ChangeImage(ev)
{
    let currentImagePreview = ev.target.closest('.temp').querySelector('.feature-img');
    let newImageInput = document.createElement('input');
    newImageInput.type = 'file';
    newImageInput.onchange = function Change()
    {
        let reader = new FileReader();
        let newImage = new Image();
        reader.onload = function (){
            newImage.src = reader.result;
            newImage.onload = function (){
                if(CheckImageResolution(newImage))
                {
                    currentImagePreview.src = newImage.src;
                    UpdateFeature(ev.target.closest('.temp').id, currentImagePreview.classList, newImage.src);
                    //sending
                    // let fakeobject = {Gameid: 5, 'MainDescription': "My main description"};
                    // let JsonDescription = JSON.stringify(fakeobject);
                    // let req = new XMLHttpRequest();
                    // req.onreadystatechange = AlertMe;
                    // req.open('POST', 'https://localhost:5001/api/game/testDescription');
                    // req.setRequestHeader('Content-Type', 'application/json');
                    // req.setRequestHeader('Authorization', 'Bearer ' + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6IjEiLCJuYmYiOjE2MDM2NTI4MzYsImV4cCI6MTYwNDI1NzYzNiwiaWF0IjoxNjAzNjUyODM2fQ.lqNts_lHbm8GB-K3LSN0uqyTenLGCsvJLV7nnt0louE');
                    // req.withCredentials = true;
                    // req.send(JsonDescription);

                    function AlertMe()
                    {
                        if (req.readyState == XMLHttpRequest.DONE) {
                            if(req.status == 200){
                                alert(req.responseText);
                            }else{
                                alert('There was a problem with the req.');
                            }
                        }
                    }
                    // alert('done');
                }
            }
        }
        reader.readAsDataURL(newImageInput.files[0]);
    }
    newImageInput.click();
}

confirmCreationButton.addEventListener('click', function CreateFeature()
{
    var featureObject = {};
    if (imagePreview.getAttribute('src') != '') {
        featureObject.Image = imagePreview.getAttribute('src');
    }
    if(document.getElementById('new-title').value == "")
    {
        featureObject.Title = "Empty Title";
    }else
    {
        featureObject.Title = document.getElementById('new-title').value;
    }   
    featureObject.Description = document.getElementById('new-description-id').value;
    var feature = newFeature(featureObject);
    document.getElementById('feature-list').appendChild(feature);
    description.Features.set(feature.id, featureObject);
    alert('confirmed');
    HideConfirmBox(addFeatureConfirmDiv);
    console.log(description.Features.entries());
});

abortCreationButton.addEventListener('click', () => HideConfirmBox(addFeatureConfirmDiv));

// cancelDeleteButton.addEventListener('click', () => HideConfirmBox(deleteFeatureDiv));

descriptionBody.addEventListener('click', function UpdateCurrentFeature(ev)
{
    if(ev.target.classList.contains('feature-description'))
    {
        ChangeDescription(ev);
    }else if(ev.target.classList.contains('change-feature')) //update image
    {
        ChangeImage(ev);
    }else if(ev.target.classList.contains('delete-feature')) //delete feature
    {
        //work on this next... 28/11/2020
        //da vidim kako/kad dodati evente za confirm
        DeleteFeature(ev);   
        // alert('howdy');
    }            
});

imageInput.addEventListener('input', function DisplayImage() {
    const file = this.files[0];
    // probably add new function or change CheckImageResolution function to check if file is of type jpeg or png.           
    if(file)
    {
        const reader = new FileReader();
        let image = new Image();
        reader.onload = function()
        {
            image.src = this.result;
            image.onload = function()
            {
                if(CheckImageResolution(image))
                {
                    imagePreviewDefaultText.style.display = 'none';
                    imagePreview.style.display = 'block';
                    imagePreview.setAttribute('src', image.src);
                    document.getElementById('image-file-name-id').innerText = file.name;
                }else
                {
                    alert('Resolution is either too large or too small!');
                }
            };                   
        };
        reader.readAsDataURL(file);
    }else
    {
        imagePreview.src = '';
        imagePreviewDefaultText.style.display = null;
        imagePreview.style.display = null;
        document.getElementById('image-file-name-id').innerText = 'File name...'
    }               
});

toggleElementsButton.addEventListener('click', () => {
    firstFeature.classList.toggle('first-feature-show');
})

collapseArea.on('show.bs.collapse', function CollapseArea()
{
    //might have to change this
    setTimeout(()=>{this.scrollIntoView({
        behavior: 'smooth', block: 'end'
    })}, 500);
})

addFeatureButton.addEventListener('click', (ev) => DisplayConfirmBox(ev.target.closest('.collapse'), addFeatureConfirmDiv));

// 1. Add ability to swap feature positions. Example switch feature 1 with feature 3. (Have to switch the data and display.) (yellow button)

// 2. Change button should just be an option to replace the image/gif.

// 3. Delete should delete the whole feature.

//element.scrollintoview properties has smooth scroll. should trigger on collapse-show do this next

//todo-first: build the ui (save button, cancel button, feature point/image input), then add logic
//highlight textarea, feature point and image area when adding new feature

//create feature object
//create new button-function that adds to description object
//save button should only update existing
//add cancel button to reset textarea, and when adding feature collapse back
//focus on window 

/* End of your code */