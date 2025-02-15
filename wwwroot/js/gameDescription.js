
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
const imageInput = document.getElementById('image-input');
const imagePreviewArea = document.getElementById('image-preview-area-id');
const imagePreview = imagePreviewArea.querySelector('.image-preview');
const imagePreviewDefaultText = imagePreviewArea.querySelector('.image-preview-default-text');

var collapseArea = $('#collapse-TextArea-Id');
const addFeatureButton = document.getElementById('add-feature-button');
var confirmDiv = document.getElementById('confirm-feature'); //need specific
var confirmButton = document.getElementById('confirm-button-id');
var cancelButton = document.getElementById('cancel-button-id');
var descriptionContent = document.querySelector(".description-content");

var cancel = function Cancel()
{
    confirmDiv.style.display = 'none';
    document.querySelectorAll('.description-content > *:not(#collapse-TextArea-Id)').forEach(function AddFilter(el, key) {
        el.style.filter = "none";
    });
    descriptionBody.style.pointerEvents = 'auto';
}

function CreateFeatureButtons(type)
{
    var button = document.createElement('button');
    var buttonColor = document.createElement('div');
    var arrow = document.createElement('div');
    if(type == 'swap')
    {
        button.classList.add('image-buttons', `${type}-feature`)
        buttonColor.innerText = "Swap with feature";
    }else
    {
        button.classList.add('image-buttons', `${type}-img`)
        buttonColor.innerText = type;
    }  
    buttonColor.classList.add('image-button-color');
    arrow.classList.add('my-arrow');
    button.appendChild(buttonColor);
    button.lastChild.appendChild(arrow);
    return button;
}

var newFeature = (function ConstructNewDOM()
{
    var getFeatureListLength = document.getElementById('feature-list').querySelectorAll('.temp').length;

    function CreateElement(featureObject)
    {
        getFeatureListLength++;
        var featureDiv = document.createElement('div');
        featureDiv.classList.add('temp');
        featureDiv.style.position = "relative";
        featureDiv.id = `feature-${getFeatureListLength}`;

        if (featureObject.Image != undefined) {
            let changeButton = CreateFeatureButtons('change');
            let deleteButton = CreateFeatureButtons('delete');
            let swapButton = CreateFeatureButtons('swap');
            featureDiv.appendChild(changeButton);
            featureDiv.appendChild(deleteButton);
            featureDiv.appendChild(swapButton);
            let Image = document.createElement('img');
            Image.src = featureObject.Image;
            Image.classList.add('feature-img', 'someotherclass');
            featureDiv.appendChild(Image);
        }
        
        var Title = document.createElement('strong');
        Title.innerText = featureObject.Title;
        Title.classList.add('feature-description', 'title');

        var Description = document.createElement('p');
        Description.innerText = featureObject.Description;
        Description.classList.add('feature-description', 'description');
        
        featureDiv.appendChild(Title);
        featureDiv.appendChild(Description);
        return featureDiv;
    }
    return CreateElement;
})();

function DisplayConfirmBox(ev)
{
    // var newConfirm = CreateConfirmBox();
    // ev.target.closest('.temp').appendChild(newConfirm);
    var confirmBox = ev.target.closest('.temp').querySelector('.confirm');
    descriptionBody.style.pointerEvents = 'none';
    // document.querySelectorAll(`.description-content:not(.feature-3)`).classList.toggle('blurAllExcept');
    var myob1 = document.querySelectorAll('.description-content:not(.feature-3)');
    // descriptionContent.classList.toggle('blurAllExcept');
    // confirmBox.classList.toggle('blurAllExcept');  
    confirmBox.style.display = 'block';
    confirmBox.style.pointerEvents = 'auto';
}

function ShowNewFeatureConfirm()
{
    descriptionBody.style.pointerEvents = 'none';
    document.querySelectorAll('.description-content > *:not(#collapse-TextArea-Id)').forEach(function AddFilter(el, key) {
        el.style.filter = "blur(2px) grayscale(70%)";
    });
    confirmDiv.style.display = 'block';
    confirmDiv.style.pointerEvents = 'auto';
}

var newConfirmBox = (function CreateConfirmBox()
{
    var confirmBox = document.createElement("div");
    var text = document.createElement("p");
    var confirmButton = document.createElement("button");
    var cancelButton = document.createElement("button");
    confirmBox.id = "confirm-box";
    confirmBox.classList.add("confirm");
    text.classList.add("confirm-Creation");
    text.innerText = "Confirm creation v2";
    confirmButton.id = "confirm-Button-id";
    confirmButton.classList.add("confirm-Button");
    confirmButton.innerText = "Confirm";
    cancelButton.id = "cancel-button-id";
    cancelButton.classList.add("cancel-button");
    cancelButton.innerText = "Cancel";
    confirmBox.append(text, confirmButton, cancelButton);

    function returnConfirm()
    {
        return confirmBox;
    }
    
    return returnConfirm;
})();

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

confirmButton.addEventListener('click', function CreateFeature()
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
    cancel();
    console.log(description.Features.entries());
});

cancelButton.addEventListener('click', cancel);

descriptionBody.addEventListener('click', function UpdateCurrentFeature(ev)
{
    if(ev.target.classList.contains('feature-description'))
    {
        ChangeDescription(ev);
    }else if(ev.target.classList.contains('change-img'))
    {
        ChangeImage(ev);
    }else if(ev.target.classList.contains('delete-img'))
    {
        //work on this next... 28/11/2020
        //da vidim kako/kad dodati evente za confirm
        DisplayConfirmBox(ev);
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
        imagePreviewDefaultText.style.display = null;
        imagePreview.style.display = null;
        document.getElementById('image-file-name-id').innerText = 'File name...'
    }               
});


collapseArea.on('show.bs.collapse', function CollapseArea()
{
    //might have to change this
    setTimeout(()=>{this.scrollIntoView({
        behavior: 'smooth', block: 'end'
    })}, 500);
})

addFeatureButton.addEventListener('click', function AddNewFeature()
{
    ShowNewFeatureConfirm();
})

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