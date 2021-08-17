// ******************************************************************************
// AnkiConnect Functions
// ******************************************************************************



function invoke(action, version, params={}) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.addEventListener('error', () => reject('failed to issue request'));
        xhr.addEventListener('load', () => {
            try {
                const response = JSON.parse(xhr.responseText);
                if (Object.getOwnPropertyNames(response).length != 2) {
                    throw 'response has an unexpected number of fields';
                }
                if (!response.hasOwnProperty('error')) {
                    throw 'response is missing required error field';
                }
                if (!response.hasOwnProperty('result')) {
                    throw 'response is missing required result field';
                }
                if (response.error) {
                    throw response.error;
                }
                resolve(response.result);
            } catch (e) {
				console.log(e);
                reject(e);
            }
        });

        xhr.open('POST', 'http://127.0.0.1:8765');
        xhr.send(JSON.stringify({action, version, params}));
    });
}


function addNote(front, back, audio_url, audio_filename, deckname="English - audio", modelName="Basic (and reversed card)"){
	/* add a  card to anki*/
	(async() => {
		const opt = {
			"note": {
				"deckName": deckname,
				"modelName": modelName,
				"fields": {
					"Front": front,
					"Back": back
				},
				"tags": [
					"OLD"
				],
				"audio": {
					"url": audio_url,
					"filename": audio_filename,
					"fields": [
						"Back"
					]
				}
			}
		};
		try{
			const result = await invoke('addNote', 6, opt);
			console.log("card created");

		} catch(e) {
			window.alert("an error occured")
		}
	})();
	
}


// ******************************************************************************
// Rest
// ******************************************************************************

function onSubmit(){
	var front = document.getElementById("aold_input_frontside").value;
	var back = document.getElementById("aold_input_backside").value;
	var audio_url = document.getElementsByClassName("phons_br")[0].getElementsByClassName("sound")[0].getAttribute("data-src-mp3");
	var audio_filename = back.replace(" ", "_") + ".mp3";
	//window.alert(audio_url);
	addNote(front, back, audio_url, audio_filename);
}

function onClose(){
	window.alert("closed")
}

function render_createCard_box(){
	// get the content from old
	var word = document.getElementsByClassName("headword")[0].textContent;
	var sense = document.getElementsByClassName("def")[0].textContent;
	sense = sense.replace(word, "______");

	var box_html = `<div id="box">\
					<form>
						<button type="button" id="aold_destroy_window_button" onclick="document.getElementById('int_btn_ext').click()">X</button>\
					</form>
					<h1>Anki Card Creator</h1>\
					<form>\
						<label class="form_content">Front</label>\
						<textarea id="aold_input_frontside" class="form_content">${ sense }</textarea>\
						<label class="form_content">Back</label>\
						<textarea id="aold_input_backside" class="form_content">${ word }</textarea>\
						<button type="button" id="aold_createCard_button" class="form_content" onclick="document.getElementById('int_btn_sub').click()">Create Card</button>\
					</form>\
				</div>`;
	var box_style = '<style>\
						#box {background-color: powderblue; width: 20%; height: 100%; position: fixed; left:0px; top:0px; padding: 0.5%;}\
						#aold_destroy_window_button{float: right;}\
						h1   {color: black;}\
						.form_content{width: 100%;}\
						textarea{padding: 5px; height: 150px;}\
						#ox-container {margin-left: 20%;};\
					</style';                         
	var container = document.createElement('div');
	container.innerHTML = box_html + box_style;
	document.getElementsByTagName('body')[0].appendChild(container);
	
	//intermediate buttons to allow execution of functions defined in this script from the innerHTML of the page
	// exit
	var int_btn_ext = document.createElement('button')
	int_btn_ext.onclick = function(){onClose()}
	int_btn_ext.setAttribute("id", "int_btn_ext");
	document.getElementsByTagName('body')[0].appendChild(int_btn_ext);
	//submit
	var int_btn_sub = document.createElement('button')
	int_btn_sub.onclick = function(){onSubmit()}
	int_btn_sub.setAttribute("id", "int_btn_sub");
	document.getElementsByTagName('body')[0].appendChild(int_btn_sub);

}


// Main Code
render_createCard_box();
	


	


