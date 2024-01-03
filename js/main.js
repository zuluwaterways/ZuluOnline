function copyLatLon(){
	navigator.clipboard.writeText(map.getCenter().lat+", "+map.getCenter().lng)
}
function doShare(tt){
  if (navigator.share) {
    navigator.share({
      title: tt,
      url: window.location.href
    }).then(() => {
      console.log('Thanks for sharing!');
    })
    .catch(console.error);
  } else {
    window.open('https://www.facebook.com/sharer/sharer.php?u='+window.location.href.replace("#","%23")+'&t='+tt, '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600')
  }
}
function moveNorth(){
	map.easeTo({bearing: 0, pitch: 0, duration: 500,easing: x => x});
	document.getElementById("northIcon").style.display = "";
}
function imageModal(im){
	console.log(im.src);
	document.getElementById("modalImage").src=im.src;
	document.getElementById("imgModal").style.display="block";
	document.getElementById("imgModalClose").style.display="block";

	panzoom(document.getElementById("modalImage"));
}
function closeImageModal(){
	document.getElementById("imgModal").style.display="none";
	document.getElementById("imgModalClose").style.display="none";
}
function closeDisModal(){
	localStorage.hydroDis = "ok";
	document.getElementById("disModalcont").style.display="none";
}
function findMarker(id){
	currentMarkers.foreach(function callbackFn(e) { if(id==e._popup.id)return e;});
	return null;
}
function saveEditedMarker(){
	//marker type changed
	if("markerInfoIcon a"+document.getElementsByClassName("markerInfoIcon")[0].title!=document.getElementsByClassName("markerInfoIcon")[0].className){
		var xhttp = new XMLHttpRequest();
		xhttp.open("POST", "https://api.zuluwaterways.com/updateHistory.php", true);
		xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		xhttp.send("id="+document.getElementsByClassName("infoHeader")[0].parentNode.id+"&user="+currentUser+"&type=i&data="+document.getElementsByClassName("markerInfoIcon")[0].title);
	}
	//marker title changed
	if(document.getElementsByClassName("markerInfoTitle")[0].title!=document.getElementsByClassName("markerInfoTitle")[0].innerText){
		var xhttp2 = new XMLHttpRequest();
		xhttp2.open("POST", "https://api.zuluwaterways.com/updateHistory.php", true);
		xhttp2.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		xhttp2.send("id="+document.getElementsByClassName("infoHeader")[0].parentNode.id+"&user="+currentUser+"&type=t&data="+document.getElementsByClassName("markerInfoTitle")[0].title);
	}
	//marker description changed
	if(document.getElementsByClassName("markerDescription")[0].innerHTML!=document.getElementById("oldDesc").innerHTML){
		var xhttp3 = new XMLHttpRequest();
		xhttp3.open("POST", "https://api.zuluwaterways.com/updateHistory.php", true);
		xhttp3.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		xhttp3.send("id="+document.getElementsByClassName("infoHeader")[0].parentNode.id+"&user="+currentUser+"&type=d&data="+document.getElementById("oldDesc").innerHTML);
	}
	//marker pictures changed
	if(document.getElementById("im1").title!=document.getElementById("im2").title){//pics changed
		var xhttp4 = new XMLHttpRequest();
		xhttp4.open("POST", "https://api.zuluwaterways.com/updateHistory.php", true);
		xhttp4.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		xhttp4.send("id="+document.getElementsByClassName("infoHeader")[0].parentNode.id+"&user="+currentUser+"&type=p&data="+document.getElementById("im1").title);
	}
	//marker tags changed
	if(document.getElementById(currentMarker).taglist!=document.getElementById(currentMarker).oldtaglist){
		var xhttp5 = new XMLHttpRequest();
		xhttp5.open("POST", "https://api.zuluwaterways.com/updateHistory.php", true);
		xhttp5.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		xhttp5.send("id="+document.getElementsByClassName("infoHeader")[0].parentNode.id+"&user="+currentUser+"&type=g&data="+document.getElementById(currentMarker).oldtaglist);
	}
	//lat/lon changed
	if(document.getElementsByClassName("markerInfoSubtitle")[0].innerText.trim()!=document.getElementsByClassName("markerInfoSubtitle")[0].title){
		var xhttp5 = new XMLHttpRequest();
		xhttp5.open("POST", "https://api.zuluwaterways.com/updateHistory.php", true);
		xhttp5.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		xhttp5.send("id="+document.getElementsByClassName("infoHeader")[0].parentNode.id+"&user="+currentUser+"&type=l&data="+document.getElementsByClassName("markerInfoSubtitle")[0].title);
	}

	var xhttp4 = new XMLHttpRequest();
	xhttp4.open("POST", "https://api.zuluwaterways.com/updateMarker.php", true);
	xhttp4.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	xhttp4.send(
		"id="+document.getElementsByClassName("infoHeader")[0].parentNode.id+
		"&user="+currentUserName+
		"&type="+document.getElementsByClassName("markerInfoIcon")[0].className.substr(16,30)+
		"&title="+document.getElementsByClassName("markerInfoTitle")[0].innerText+
		"&tags="+document.getElementById(currentMarker).taglist+
		"&pics="+document.getElementById('im2').title+
		"&lat="+document.getElementsByClassName("markerInfoSubtitle")[0].innerText.trim().split(", ")[0]+
		"&lon="+document.getElementsByClassName("markerInfoSubtitle")[0].innerText.trim().split(", ")[1]+
		"&desc="+encodeURIComponent(document.getElementsByClassName("markerDescription")[0].innerHTML));

	xhttp4.onreadystatechange = function() {
	  if (this.readyState == 4 && this.status == 200) {
			new Toast({message: 'Marker Updated<br> Thanks you helping grow this community!'});
			endEdit();
			map.flyTo({center: [currentPopup._lngLat.lng,currentPopup._lngLat.lat],zoom: map.getZoom()-0.5,essential: true});
			loadIcons();
		}
	};
}
function saveNewMarker(){
	
	var xhttp4 = new XMLHttpRequest();
	xhttp4.open("POST", "https://api.zuluwaterways.com/addMarker.php", true);
	xhttp4.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	
	xhttp4.onreadystatechange = function() {
	  if (this.readyState == 4 && this.status == 200) {
			new Toast({message: 'Marker Uploaded.<br> Thanks you helping grow this community!'});
			map.flyTo({center: [currentPopup._lngLat.lng,currentPopup._lngLat.lat],zoom: 12,essential: true});
			endEdit();
			toOpen = this.responseText;
			loadIcons();
			var xhttp2 = new XMLHttpRequest();
			xhttp2.open("POST", "https://api.zuluwaterways.com/updateHistory.php", true);
			xhttp2.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
			xhttp2.send("id="+this.responseText+"&user="+currentUser+"&type=n&data=none");
		}
	};
	xhttp4.send("lat="+document.getElementsByClassName("newMarkerLatLon")[0].innerText.split(',')[0]+"&lon="+document.getElementsByClassName("newMarkerLatLon")[0].innerText.split(',')[1]+"&user="+currentUserName+"&type="+document.getElementsByClassName("markerInfoIcon")[0].className.substr(16,30)+"&title="+document.getElementsByClassName("markerInfoTitle")[0].innerText+"&pics="+document.getElementById("im2").title+"&tags="+document.getElementById(currentMarker).taglist+"&desc="+encodeURIComponent(document.getElementsByClassName("markerDescription")[0].innerHTML));
}
function doRepos(){
	document.getElementById("relocateButton").style.display="none";
	document.getElementById("searchbardiv").className="searchbarhidden";
	if(isEditing){ //reposition marker
		currentMarkers.forEach(function callbackFn(e) { if(e.getPopup().id == currentMarker)e.setLngLat(map.getCenter())});
		currentPopup.getElement().style.display="";
		isEditing =false;
		if(document.getElementsByClassName('newMarkerLatLon').length>0)document.getElementsByClassName('newMarkerLatLon')[0].innerHTML=Math.round(map.getCenter().lat*100000)/100000+", "+Math.round(map.getCenter().lng*100000)/100000+"<div class=\"relocate\" onclick=\"relocate()\"></div>";
		if(document.getElementsByClassName('markerInfoSubtitle').length>0)document.getElementsByClassName('markerInfoSubtitle')[0].innerHTML=Math.round(map.getCenter().lat*100000)/100000+", "+Math.round(map.getCenter().lng*100000)/100000+"<div class=\"relocate\" onclick=\"relocate()\"></div>";
		checkOnScreen();
	}else{
		currentMarker="newMarkerUnsaved";
		var el = document.createElement('div');
  		el.className = 'marker a58aba649b0fb4d1a34428dfa' ;
		newp = new mapboxgl.Popup({offset:25}).setHTML('<div id="newMarkerUnsaved"><div class="infoHeader"><ul id="markerIconMenu"><li><div class="markerInfoIcon a58aba649b0fb4d1a34428dfa" onclick="showMarkerList()"></div>'+
			'<ul onclick="changeMarkerType()" id="markerIconDropdown"></ul></li></ul><div class="markerInfoTitle newMarkerTitle" contenteditable =true placeholder="Title"></div>'+
			'<div class="markerInfoSubtitle newMarkerLatLon">0,0</div></div><br><div id=\"tags"\"></div><div class="infoi1 newMarkerImage1" id="im1"></div>'+
			'<div class="markerDescription newMarkerDesc" contenteditable =true placeholder="Detailed information goes here..."></div><div id=\"im2\"></div><div id=\"im3\"></div>'+
			'<div class=\"markerPicBar"></div><hr><div class="newmarkerSubbar"></div><hr><div onclick="saveNewMarker()" class="saveNMButton" id="saveButtondiv">Save</div><div class="saveNMBError"></div></div>');
		newp.id="newMarkerUnsaved";
		
		newp.setMaxWidth('400px');
		currentPopup = newp;
  		newm = new mapboxgl.Marker(el).setLngLat(map.getCenter()).setPopup(newp ).addTo(map);
		currentMarkers.push(newm);
		newm.togglePopup();
		var ems = document.getElementsByClassName('newMarkerLatLon')
		for(var i=0;i<ems.length;i++){ems[i].innerHTML=Math.round(map.getCenter().lat*100000)/100000+", "+Math.round(map.getCenter().lng*100000)/100000+"<div class=\"relocate\" onclick=\"relocate()\"></div>";}
		var ebs = document.getElementsByClassName('newmarkerSubbar')
		for(var i=0;i<ebs.length;i++){ebs[i].innerHTML="Created by:"+currentUserName+" | Updated:"+(new Date()).toLocaleDateString()+" | <span> Report </span> | <span id=\"editButton\"> Editing </span>"};
		document.getElementById("newMarkerUnsaved").taglist="";
		buildTags(true);
		checkOnScreen();
		buildPicEditor();

	}
}
function doEdit(vv){
	if(currentUserName==""){
		new Toast({message: 'Please login before editing!'});
	}else{
		if (event.target.innerHTML == "Editing"){
			endEdit();
		}else{
			document.getElementsByClassName("markerInfoTitle")[0].contentEditable = true;
			document.getElementsByClassName("markerDescription")[0].contentEditable = true;
			document.getElementsByClassName("markerDescription")[0].style.minHeight="200px";
			document.getElementsByClassName('markerInfoIcon')[0].innerHTML = "-change-";
			document.getElementsByClassName('markerInfoIcon')[0].onclick=function(){showMarkerList();};
			buildTags(true);
			document.getElementsByClassName('markerInfoSubtitle')[0].innerHTML=currentPopup._lngLat.lat+", "+currentPopup._lngLat.lng+"<div class=\"relocate\" onclick=\"relocate()\"></div>";
		
			setTimeout(function() {
    				document.getElementsByClassName("markerDescription")[0].focus();
			}, 500);
			document.getElementById("saveButtondiv").innerHTML="<div onclick=\"saveEditedMarker()\" class=\"saveNMButton\">Save</div>"
			event.target.innerHTML = "Editing";
			buildPicEditor();
			document.getElementById("saveButtondiv").scrollIntoView();
		}
	}
}
function changeUsername(){
	document.getElementById("modalDiv").style.transform="scale(1)";
	document.getElementById("changeNameModal").style.display="block";
	document.getElementById("changeNameModal").style.transform="scale(1)";
	document.getElementById("newNameInput").value=currentUserName;
}
function doChangeUsername(){
	document.getElementById("modalDiv").style.transform="scale(0)";
	document.getElementById("loginModal").style.transform="scale(0)";
	document.getElementById("changeNameModal").style.display="none";
	document.getElementById("changeNameModal").style.transform="scale(0)";
	currentUserName = document.getElementById("newNameInput").value;
	firebase.auth().currentUser.updateProfile({displayName: currentUserName  });
	document.getElementById("loginButton").innerHTML=((firebase.auth().currentUser.photoURL!=null && firebase.auth().currentUser.photoURL.length>3)?('<img src="'+firebase.auth().currentUser.photoURL+'">'):"")+' <span onclick="changeUsername()">'+currentUserName+"</span>";
	
	new Toast({message: 'Username Updated!'});

}
function doDelete(){
	if(document.getElementById("newNameInput").value=="Delete Me!"){
		firebase.auth().currentUser.delete();
		document.getElementById("modalDiv").style.transform="scale(0)";
		document.getElementById("loginModal").style.transform="scale(0)";
		document.getElementById("changeNameModal").style.display="none";
		document.getElementById("changeNameModal").style.transform="scale(0)";
	}else{
		window.alert("To delete your account please type \"Delete Me!\" in the text box above");
	}
}
function relocate(){
	currentPopup.getElement().style.display="none";
	map.flyTo({center: [currentPopup._lngLat.lng,currentPopup._lngLat.lat],zoom: map.getZoom(),essential: true});
	isEditing = true;
	document.getElementById("relocateButton").style.display="block";
}
function addTag(){
	document.getElementById("tagSearchDiv").style.display=document.getElementById("tagSearchDiv").style.display=="none"?"block":"none";
	searchTag();
}
function removeTag(){
	var em = event.target.parentNode.children[1];
	em.style.display=em.style.display=="none"?"inline":"none";
}
function deleteTag(){
	document.getElementById(currentMarker).taglist = document.getElementById(currentMarker).taglist.replace(event.target.parentNode.children[0].innerText,"");
	buildTags(true);
}
function searchTag(){
	var searchterm = document.getElementById("taginput").value.trim();
	if(event.key=="Enter"){
		document.getElementById(currentMarker).taglist+=(document.getElementById(currentMarker).taglist.trim()==""?"":":")+searchterm;
		buildTags(true);
		document.getElementById("taginput").value=="";
		
		
		document.getElementById("tagSearchDiv").style.display="";
	}
		var ins = "";
		for(var i = 0; i<tagList.length;i++){
			if(searchterm =="" || tagList[i].toLowerCase().indexOf(searchterm.toLowerCase())>=0)ins+='<li class="searchTag tag'+tagList[i]+'">'+tagList[i]+"</li>";
		}
		document.getElementById("tagSearchResults").innerHTML=ins;
	
}
function addTagtoList(){
	if(event.target.tagName!="LI")return;
	if(document.getElementById(currentMarker).taglist.indexOf(event.target.innerHTML)!=-1)return;
	document.getElementById(currentMarker).taglist+=(document.getElementById(currentMarker).taglist.trim()==""?"":":")+event.target.innerHTML;
	buildTags(true);
	document.getElementById("taginput").value=="";
	searchTag();
	document.getElementById("tagSearchDiv").style.display="";
	}
var tagList=["Noisy","Quiet","Good Holding","V.Good Holding","Protected","Deep (8m/26'+)","Near shops","Near Transport","Tidal","Dock","Floating Dock","Near water","Diesel","Unleaded","Pump out","Water","Shops near by","Wash down","Self Service","Full service","Under 1.5m (5ft)","Under 1m (3ft)","Under 0.5m (1'6\")","Social","Unprotected","Multi Hull Friendly","Motorboat Friendly","V. Good Holding","Poor Holding","Close to shops","Close to Transport","Free To Use","Near Facilities","Pay To Use","Free camp site","Quiet Camp Site","Bins","Amenities","Swimming","Over Priced","Difficult Access","Membership Required","Public Tap","Boat Fill Up","Jerry Can Fill","Private Tap","Boat Fill Up Point","Wash Down Avaliable","Payment Required","Quality Questionable","Near Bins","Lock Dinghy","Bus","Train","Ferry","Taxi","Tuk Tuk","Bike Rental","Car Rental","Tour Buses","Rocks","Reef","Shallows","Heavy Traffic","Marine Sanctuary","Engine Repairs","Dinghy Repairs","Fibre Glass Repair","Rigging","Painting","Plumbing","Sail Repair","Shallow","Shore Swimming","Public 24hr mooring","Dock side power","Dock Side Water","Fuel Dock","Under 2m depth","Wifi","Floating docks","Fixed Docks","Slipway at Marina","Showers/Toilets","Good Security","Poor Security","Laundry Avaliable","Canvas Work","Internet/Phone Reception","No Phone/Internet Reception","Internet Access","No Internet Access","V. Deep (12m/40'+)","Quality Unknown","Quality Good","Hose Provided","Public Bins","Private Bins","Exposed to Swell","Exposed to Wind","Water Avaliable","Electricity Avaliable","No Internet Access.","No Water Avaliable","No Electricity","Slipway","Liveaboard Friendly","Well Serviced","Poorly Serviced","Lifting","Fixed","V. Deep (12m/40ft+)","Pet Friendly","Dog Friendly","V. Protected","Under 1.5m/5ft deep","Alcohol","Cheap","Expensive","Food","Vegan","Vegetarian","Ameneties","GF options","Groceries","Local Produce","Chandlery","Fruit+Veg","Volunteer Opportunities","Environmental","Humanitarian","Marine","Animal","48hr Limit","12hr Limit","Gas/Propane","Garbage disposal","Recycling Options","VHF Reception","No VHF Reception","Marina Mooring","Drop Off","Free","Public","Private","Showers","Toilets","Pump Out Facility","Day Use Only","Commercial","Dive Boat Only","Mooring Field","Not permitted","Extremely poor holding","Dangerous tidal effects","Too shallow!","Causeway","Underwater Obstruction","Ethanol Free Gasoline"];
function getPic(){
	document.getElementById("newPicInput").click();
}
function gotPic(){
	var canvas = document.createElement('canvas');
	var canvasContext = canvas.getContext('2d');
	canvas.setAttribute("style", 'opacity:0;position:absolute;z-index:-1;top: -100000000;left:-1000000000;width:320px;height:240px;')
  document.body.appendChild(canvas);
  
  var img = new Image;
  img.onload = function() {
	var MAX_WIDTH = 800;
var MAX_HEIGHT = 600;
var width = img.width;
var height = img.height;

if (width > height) {
  if (width > MAX_WIDTH) {
    height *= MAX_WIDTH / width;
    width = MAX_WIDTH;
  }
} else {
  if (height > MAX_HEIGHT) {
    width *= MAX_HEIGHT / height;
    height = MAX_HEIGHT;
  }
}
canvas.width = width;
canvas.height = height;

      canvasContext.drawImage(img, 0, 0, width, height);
    	var base64Image = canvas.toDataURL('image/jpeg', 0.7);
	var el = document.getElementById("im1").innerHTML.length==0?document.getElementById("im1"):(document.getElementById("im2").innerHTML.length==0?document.getElementById("im2"):document.getElementById("im3"));
      	currentlyEditingPic = el;
	el.innerHTML='<img class="infoPic" title="notUploaded!!!" src="'+base64Image+'" onclick="imageModal(this)">';
	buildPicEditor();
	sendImage(base64Image);      
      document.body.removeChild(canvas);
    	URL.revokeObjectURL(img.src);
  }
	img.src = URL.createObjectURL(event.target.files[0]);
}
var currentlyEditingPic = "";

function sendImage(data) {
    var ajax = new XMLHttpRequest();
    ajax.open('POST', 'https://api.zuluwaterways.com/uploadImg.php?tk=8oacyn5si4l6ej6yx4o9vy698s3bzn5ylmc2', true);
    ajax.setRequestHeader('Content-Type', 'application/octet-stream');
	ajax.setRequestHeader('Access-Control-Allow-Origin', '*');
    ajax.onreadystatechange = function() {
        if (ajax.readyState === XMLHttpRequest.DONE) {
            if (ajax.status === 200) {
		currentlyEditingPic.children[0].title = ajax.response;
		buildPicEditor();
                console.log(ajax.response);
		var xhttp2 = new XMLHttpRequest();
		xhttp2.open("POST", "https://api.zuluwaterways.com/updateHistory.php", true);
		xhttp2.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		xhttp2.send("id="+currentMarker+"&user="+currentUser+"&type=u&data="+ajax.response);

            } else {
                console.log("fail");
            }
        }
    };
    ajax.send(data);
}
function buildPicEditor(){
	var pb = '<div id="picButton" onclick="getPic()"></div><input type="file" id="newPicInput" style="display:none" onchange="gotPic()"><canvas id="cancan" style="display:none"></canvas>';
	if(document.getElementById("im1").children.length>0)pb+="<div id=\"i1\"><img src=\""+document.getElementById("im1").children[0].src+'" onclick="removeTag()"><button class="deleteTag" style="display:none" onclick="deletePic()">X</button></div>';
	if(document.getElementById("im2").children.length>0)pb+="<div id=\"i2\"><img src=\""+document.getElementById("im2").children[0].src+'" onclick="removeTag()"><button class="deleteTag" style="display:none" onclick="deletePic()">X</button></div>';
	if(document.getElementById("im3").children.length>0)pb+="<div id=\"i3\"><img src=\""+document.getElementById("im3").children[0].src+'" onclick="removeTag()"><button class="deleteTag" style="display:none" onclick="deletePic()">X</button></div>';
	document.getElementsByClassName("markerPicBar")[0].innerHTML=pb;
	document.getElementById("im2").title = (document.getElementById("im1").children.length==0?"":document.getElementById("im1").children[0].title)+
		(document.getElementById("im2").children.length==0?"":(":"+document.getElementById("im2").children[0].title))+
		(document.getElementById("im3").children.length==0?"":(":"+document.getElementById("im3").children[0].title));
}
function deletePic(){
	if(event.target.parentNode.id=="i1")document.getElementById("im1").innerHTML="";
	if(event.target.parentNode.id=="i2")document.getElementById("im2").innerHTML="";
	if(event.target.parentNode.id=="i3")document.getElementById("im3").innerHTML="";
	buildPicEditor();
}


function endEdit(vv){
	document.getElementsByClassName("markerInfoTitle")[0].contentEditable = false;
	document.getElementsByClassName("markerDescription")[0].contentEditable = false;
	document.getElementsByClassName("markerDescription")[0].style.minHeight="20px";
	document.getElementById("saveButtondiv").innerHTML="";
	document.getElementById("editButton").innerHTML="Edit";
}

function changeMarkerType(){
	var pn = event.target.tagName=="LI"?event.target:event.target.parentNode;
	if(pn.tagName!="LI")return;
	pn.parentNode.parentNode.children[0].className="markerInfoIcon "+pn.children[0].className;
	document.getElementById("markerIconDropdown").innerHTML="";
	console.log("here");
}
function showReport(){
	document.getElementById("reportDiv").style.display=document.getElementById("reportDiv").style.display=="none"?"block":"none";
}
function doReport(){
	event.target.onclick=function(){};
	document.getElementById("reportDiv").style.display="none";
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
	  if (this.readyState == 4 && this.status == 200) {
		new Toast({message: 'Marker Reported! Thank-you'});
	}
	};
	xhttp.open("GET", "https://api.zuluwaterways.com/report.php?ids="+currentPopup.id+"&lat="+currentPopup._lngLat.lat+"&lon="+currentPopup._lngLat.lng+"&usr="+currentUser+"&info="+document.getElementById("reportInput").value, true);
	xhttp.send();
}
function doComment(){
	document.getElementById("commentBox").style.display="none";
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
	  if (this.readyState == 4 && this.status == 200) {
		new Toast({message: 'Comment Added! Thank-you'});
		loadComments(currentMarker);
		var xhttp3 = new XMLHttpRequest();
		xhttp3.open("POST", "https://api.zuluwaterways.com/updateHistory.php", true);
		xhttp3.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		xhttp3.send("id="+currentPopup.id+"&user="+currentUser+"&type=c&data="+document.getElementById("commentText").value);
		
	}
	};
	xhttp.open("GET", "https://api.zuluwaterways.com/comment.php?marker="+currentPopup.id+"&user="+currentUserName+"&com="+document.getElementById("commentText").value, true);
	xhttp.send();
}

function rebuildMeasure(){
	for(var i = 0;i<measureMarkers.length;i++)measureMarkers[i].remove();
	measureMarkers=[];
	document.getElementsByClassName("measureShareButton")[0].style.display = "none";
	var tl = 0;
	if(map.getSource('measureLine')==null)addMeasureLayers();
	map.moveLayer("route");
	map.moveLayer("symbols");
	var hs = "";
	measureMidpoint.features=[];
	measureLine.features=[];
	for(var i=0;i<measurePoints.length;i++){
		var el = document.createElement('div');
		el.title = i;
		el.addEventListener('contextmenu', function(ev) {measurePoints.splice(ev.target.title,1);rebuildMeasure(); ev.preventDefault(); return false;}, false);
  		el.className = 'measuremarker measureicon';
		var newp = new mapboxgl.Popup({offset:25}).setHTML('<div id="measureMarker'+i+'">'+measurePoints[i][0]+'<br>'+measurePoints[i][1]+'<br><button onclick="deleteMeasure('+i+')">Delete</button></div>');
  		var newm = new mapboxgl.Marker(el,{offset: [0, -18]}).setLngLat(measurePoints[i]).setPopup(newp ).addTo(map);
		newm.setDraggable(true);
		newm.order = i;
		newm.on('dragend', e => {afterDrag(e)});
		measureMarkers.push(newm);
		hs+= "/"+Math.round(measurePoints[i][1]*100000)/100000+"/"+Math.round(measurePoints[i][0]*100000)/100000;
		if(i>0){
			var dp = (new mapboxgl.LngLat(measurePoints[i-1][0],measurePoints[i-1][1])).distanceTo(new mapboxgl.LngLat(measurePoints[i][0],measurePoints[i][1]))*(units=='metric'?"1":(units=='imperial'?0.621371:0.539957));
			tl+=dp;
			mpt = Math.round(dp)/1000+(units=='metric'?"km":(units=='imperial'?"m":"nm"));
			if(i>1)mpt+="\n"+Math.round(tl)/1000+(units=='metric'?"km":(units=='imperial'?"m":"nm"));
			mpt+="\n"+getBearing(measurePoints[i-1],measurePoints[i])+'\u00B0';
			measureMidpoint.features.push({'type': 'Feature',"properties": {"title": mpt}, 'geometry': {'type': 'Point','coordinates':[measurePoints[i-1][0]+((measurePoints[i][0]-measurePoints[i-1][0])/2),measurePoints[i-1][1]+((measurePoints[i][1]-measurePoints[i-1][1])/2)]}});
		}
	}
	 
                if (measurePoints.length>0){
			measureLine.features = [{'type': 'Feature','geometry': {'type': 'LineString','coordinates': measurePoints}}];
			document.getElementsByClassName("measureShareButton")[0].style.display = "block";
		}
		map.getSource('measureLine').setData(measureLine);
		map.getSource('measureMidpoint').setData(measureMidpoint);
	if(hs!="")window.location.hash = "/route/"+Math.round(map.getCenter().lat*100000)/100000+"/"+Math.round(map.getCenter().lng*100000)/100000+"/"+(Math.round(map.getZoom())-1)+hs;
}
function getBearing(p1,p2){
dy = p2[1] - p1[1];
dx = p2[0] - p1[0];
mb = Math.round((Math.atan2(dy, dx) * 180 / Math.PI-90)*-10)/10;
return mb>0?mb:(360+mb) ;

}
function toggleMeasure(){
	measuring = !measuring;
	document.getElementsByClassName("mapboxgl-canvas-container")[0].style.cursor = measuring?"crosshair":"";
	document.getElementsByClassName("measureButton")[0].style.backgroundColor=measuring?"seagreen":"";
	if(!measuring){
		measurePoints=[];
		rebuildMeasure();
	}
}
function addMeasure(e){
	measurePoints.push([e.lngLat.lng,e.lngLat.lat]);
	rebuildMeasure();
}
function afterDrag(e){
	measurePoints[e.target.order] = [e.target._lngLat.lng,e.target._lngLat.lat];
	rebuildMeasure();
}
function deleteMeasure(e){
	measurePoints.splice(e, 1);
	rebuildMeasure();
}
function zoomLoc() {
	geolocate.trigger()
	navigator.permissions.query({name:'geolocation'}).then(function(result) {
	if (result.state == 'denied') {
      		new Toast({message: 'Location Blocked! Please enable in your browser.'});
    		}
  	});
}
function toggleAdminFeed(){
	document.getElementById("adminFeed").style.left = document.getElementById("adminFeed").style.left=="0px"?"-500px":"0px";
	document.getElementsByClassName("adminButton")[0].style.backgroundColor= document.getElementsByClassName("adminButton")[0].style.backgroundColor=="seagreen"?"":"seagreen";
	
	refreshFeed();
}

function refreshFeed(){
	var xhttp = new XMLHttpRequest();
	
	xhttp.onreadystatechange = function() {
	  if (this.readyState == 4 && this.status == 200) {
		var feedLists = "";
		var rows = this.responseText.split("\r\n");
		for (i = 0; i < rows.length; i++) {
			var vals = rows[i].split(";");
			feedLists += "<li onclick=\"showMoreAdmin()\"><div>"+vals[2]+"<br>"+vals[3]+"</div><div>";
			if(vals[1]=="n") feedLists += "New marker created.";
			if(vals[1]=="t") feedLists += "Title changed from: "+vals[4];
			if(vals[1]=="g") feedLists += "Tags changed from: "+vals[4];
			if(vals[1]=="d") feedLists += "Description changed from: "+vals[4];
			if(vals[1]=="c") feedLists += "Comment added: "+vals[4];
			if(vals[1]=="i") feedLists += "Marker type changed from: "+vals[4];
			if(vals[1]=="u") feedLists += "Picture Uploaded: "+vals[4];
			if(vals[1]=="p") feedLists += "Pictures change from: "+vals[4];
			if(vals[1]=="a") feedLists += "Comment added: "+vals[4];
			if(vals[1]=="l") feedLists += "Marker relocated from: "+vals[4];
			feedLists +="</div><button onclick=\"gotoMarkerAdmin('"+vals[0]+"')\">-></button></li>";
		}
		document.getElementById("adminFeedList").innerHTML = feedLists;
	  }
	};
	xhttp.open("GET", "https://api.zuluwaterways.com/feed.php", true);
	xhttp.send();

}
function iOS() {
  return [
    'iPad Simulator',
    'iPhone Simulator',
    'iPod Simulator',
    'iPad',
    'iPhone',
    'iPod'
  ].includes(navigator.platform)
  // iPad on iOS 13 detection
  || (navigator.userAgent.includes("Mac") && "ontouchend" in document)
}
function checkIOS(){
	console.log(event);
	if(iOS()){
		//event.preventDefault();
		event.target.href = "https://apps.apple.com/au/app/zulu-offline/id1522412216";
	}
}
function deleteMarker(){
	
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
	  if (this.readyState == 4 && this.status == 200) {
		console.log(this.responseText);
		new Toast({message: this.responseText.trim()==""?"Auth Error!":this.responseText});
		loadIcons();
		}
	};
	xhttp.open("GET", "https://api.zuluwaterways.com/delete.php?ids="+currentPopup.id.trim()+"&tk="+currentUserId, true);
	xhttp.send();
	if(currentPopup!=null)currentPopup.remove();
}

function signOut(){
		document.getElementById("loginButton").innerHTML="<a>Login</a>";
		closeModal();
		currentUser="";
		currentUserName="";
		currentUserId="";
		firebase.auth().signOut();
		document.getElementById("signOutButton").style.display="none";
		document.getElementById("myMarkersButton").style.display="none";
}