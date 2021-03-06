(function(){

		var EventUtil = {

			// binding method for obj
			addHandler : function(obj, method, fname){

				if (obj.addEventListener){
					// *
					obj.addEventListener(method, fname, false);
				}else{
					// IE
					obj.attachEvent("on"+method, fname);
				}
			},

			removeHandler : function(obj, method, fname){

				if (obj.removeEventListener){
					// *
					obj.removeEventListener(method, fname, false);
				}else{
					// IE
					obj.detachEvent("on"+method, fname);
				}
			},

			getEvent : function(event){

				return event ? event : window.event;
			},

			getTarget : function(event){

				return event.target || event.srcElement;
			},

			preventDefault : function(event){

				if (event.preventDefault){
					event.preventDefault();
				}else{
					event.returnValue = false;
				}
			},

			stopPropagation : function(event){
				
				if (event.stopPropagation){
					event.stopPropagation();
				}else{
					event.cancelBubble = true;
				}
			}
		};
		

		// 返回主页面
		var returnmainpage = document.querySelector("#main-header-logo");
		EventUtil.addHandler(returnmainpage, "click", ReturnToMain);
		function ReturnToMain(){
			location.href = "index.html";
		}
		

		// 根据button改变页面
		
		function ShowTechPage(event){

			var target = EventUtil.getTarget(event);

			switch (target.innerHTML){
				case "Tech" : location.href = "tech.html";break;
				case "Node" : location.href = "node.html";break;
				case "Game" : location.href = "game.html";break;
				case "Life" : location.href = "life.html";break;
				case "Inte" : location.href = "inte.html";break;
				
			}
		}
		

		var techButton = document.querySelectorAll(".button-list-det");
		
		for (var i = 0; i < techButton.length; i++){

			EventUtil.addHandler(techButton[i], "click", ShowTechPage);
		}
		


		// div高度错落，即=== 其中a高度 + 10px（上） + 10px（下）
		var alldiv = document.querySelectorAll(".main-search-div");

		// 刚进来用window.onload判断
		EventUtil.addHandler(window, "load", changeHeight);
		EventUtil.addHandler(window, "resize", changeHeight);

		function changeHeight(){
			// 根据不同改变样式

			var nowlinum = alldiv[0].querySelectorAll("li")[1];

			if (getCss(nowlinum).height === "auto"){ // 是小型屏幕
				for (var i = 0; i < alldiv.length; i++){

					alldiv[i].style.height = "auto";    // div自适应高度
				}
			}else{
				for (var i = 0; i < alldiv.length; i++){

					var tempheight = getCss(alldiv[i].children[0]);   // 取到a的高度
					alldiv[i].style.height = parseFloat(tempheight.height) + 60 + "px";    // div自适应高度
				}
			}
		}


		function getCss(element){
			// 计算综合样式
			if (document.defaultView.getComputedStyle){
				return document.defaultView.getComputedStyle(element, null);
			}else{
				return element.currentStyle;   // IE
			}
		}



		// 翻页prev, next
		var prevbutton = document.getElementById("changeraws-lblock");
		var nextbutton = document.getElementById("changeraws-rblock");
		EventUtil.addHandler(prevbutton, "click", ChangeRows);
		EventUtil.addHandler(nextbutton, "click", ChangeRows);

		var showpageid = document.getElementById("changeraws-mblock");
		// 刚进来用window.onload添加页数
		EventUtil.addHandler(window, "load", AddPageId);

		function AddPageId(){
			var rows = document.querySelectorAll(".rows");
			if(rows.length){
				showpageid.innerHTML = "1/" + rows.length;
			}else{
				showpageid.innerHTML = "0/" + rows.length;
			}
			
		}

		function ChangeRows(e){
			var rows = document.querySelectorAll(".rows");
			var target = EventUtil.getTarget(e);
			//returnmainpage.scrollIntoView();   // let the beginning show
			if(target.id === "changeraws-lblock"){
				// prev button
				for (var i = 0; i < rows.length; i++){
					if (getCss(rows[i]).display === "flex" && rows.length > 1){
						if (i !== 0){
							rows[i - 1].className = rows[i].className;
							showpageid.innerHTML = i + "/" + rows.length;
						}else{
							// 已经是第一个了，直接到最后一个
							rows[rows.length - 1].className = rows[i].className;
							showpageid.innerHTML = rows.length + "/" + rows.length;
						}
						var tempclass = rows[i].className + "";
						tempclass = "rowhide " + tempclass.split(" ")[1];
						rows[i].className = tempclass;
						break;   // 立刻退出，否则陷入无限循环
					}
				}
			}else{
				// next button
				for (var i = 0; i < rows.length; i++){
					if (getCss(rows[i]).display === "flex" && rows.length > 1){
						if (i !== rows.length - 1){
							rows[i + 1].className = rows[i].className;
							showpageid.innerHTML = (i+2) + "/" + rows.length;
						}else{
							// 已经是最后了，直接到第一个
							rows[0].className = rows[i].className;
							showpageid.innerHTML = "1/" + rows.length;
						}
						var tempclass = rows[i].className + "";
						tempclass = "rowhide " + tempclass.split(" ")[1];
						rows[i].className = tempclass;
						break;   // 立刻退出，否则陷入无限循环
					}
				}
			}
			changeHeight();        // 只能放最后


			// 滑到最上面
			var topheight =  (document.documentElement.scrollTop || 0) + (document.body.scrollTop || 0);
			var step = parseInt(topheight / 20);
			(function(){
				topheight -= step;
				if (topheight > -step){
					document.documentElement.scrollTop === 0? document.body.scrollTop = topheight : document.documentElement.scrollTop = topheight;
               		setTimeout(arguments.callee, 20);
				}
			})();
		}

	})();