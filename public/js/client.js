$('document').ready(function () {
	(function(Calls) {
		
		init = function()
		{
			//require(['Peer'], function (Peer) {
				// Listeners for calls
				socket.on("plugins.incomingCall."+app.user.uid, function(data){
					console.log(data);
					app.alert({
						type: 'success',
						timeout: 0,
						title: 'Llamada Entrante',
						message: ""+data.username+" te esta llamando. <br> <a id='answerCall'>Responder</a> | <a id='closeCall'>Rechazar</a> <video style='display:none;' autoplay id='callStream'></video>",
						alert_id: 'actualCall'
					});
					setTimeout(function(){
						$("#alert_button_actualCall").find(".close").hide();
						$("#answerCall").on("click", function(){
							app.user.peer.actualCallUsername = data.username;
						    socket.emit("plugins.acceptedIncomingCall", {peerid:app.user.peer.id, youruid:data.uid});
						    app.alert({
								type: 'success',
								timeout: 0,
								title: 'Llamada en curso',
								message: "Hablando con "+app.user.peer.actualCallUsername+". <br> <a id='closeCall'>Colgar</a> <video style='display:none;' autoplay id='callStream'></video>",
								alert_id: 'actualCall'
							});
							setTimeout(function(){
								$("#alert_button_actualCall").find(".close").hide();
								$("#closeCall").on("click", function(){
								    app.user.call.close();
								    $("#alert_button_actualCall").remove();
								});
							}, 200);
						});
						$("#closeCall").on("click", function(){
							app.user.call.close();
						    $("#alert_button_actualCall").remove();
						});
					}, 200);
				});

				socket.on("plugins.acceptedIncomingCall."+app.user.uid, function(data){
					// Call to the peer
					app.user.peer.actualCallUsername = data.username;
					navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
					navigator.getUserMedia({video: false, audio: true}, function(stream) {
					  app.user.call = app.user.peer.call(data.peerid, stream);
					  app.user.call.answer(stream); // Answer the call with an A/V stream.
						app.user.call.on('stream', function(remoteStream) {
						  // Show stream in some video/canvas element.
						  $('#callStream').prop('src', URL.createObjectURL(remoteStream));
						  //console.log("Received stream..");
						});
						app.user.call.on("close", function(){
							$("#alert_button_actualCall").remove();
						});
					  app.alert({
							type: 'success',
							timeout: 0,
							title: 'Llamada en curso',
							message: "Hablando con "+app.user.peer.actualCallUsername+". <br> <a id='closeCall'>Colgar</a> <video style='display:none;' autoplay id='callStream'></video>",
							alert_id: 'actualCall'
						});
					  	setTimeout(function(){
					  		$("#alert_button_actualCall").find(".close").hide();
							$("#closeCall").on("click", function(){
							    app.user.call.close();
							    $("#alert_button_actualCall").remove();
							});
						}, 200);
					}, function(err) {
					  console.log('Failed to get local stream' ,err);
					});
				});

				// Call button on profile
				$(window).on('action:ajaxify.contentLoaded', function () {
					try{
						if( document.URL.indexOf("/user") > -1 && $("#chat-btn") )
						{	// Si estamos en el perfil de un usuario, ponemos los botones y demas
							$($("#chat-btn").parent()).append('<br><br><a href="#" class="btn btn-primary" onclick="callUser()">Llamar</a>');
						}
					}catch(e){
					}
				});

				// Change it with your api key!!
				app.user.peer = new Peer({ key: 'lwjd5qra8257b9', debug: 3});

				// Prepare for call answer
				navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
				app.user.peer.on('call', function(call) {
					app.user.call = call;
				  navigator.getUserMedia({video: false, audio: true}, function(stream) {
				  	call.answer(stream); // Answer the call with an A/V stream.
				    call.on('stream', function(remoteStream) {
				      // Show stream in some video/canvas element.
				      $('#callStream').prop('src', URL.createObjectURL(remoteStream));
				      //console.log("Received stream..");
				    });
				    call.on("close", function(){
						$("#alert_button_actualCall").remove();
					});
				  }, function(err) {
				    console.log('Failed to get local stream' ,err);
				  });
				});
			//});
		}

		callUser = function()
		{
			var uid = $(".account").attr("data-uid");
			socket.emit("plugins.callUser", {uid:uid}, function(err,data){});
			app.alert({
				type: 'success',
				timeout: 0,
				title: 'Llamando..',
				message: "Si responde a la llamada deberás permitir el acceso al micro y empezar a hablar con el/ella.",
				alert_id: 'actualCall'
			});
		}

		init();

	})(window.Calls);
});
