/**
 * 男孩走路
 * @param {[type]} container [description]
 */
 function boyWalk(){
 	var container = $('#content');
 	//可视区域
 	var visualheight = container.height();
 	var visualwidth = container.width();

 	var $boy = $('#boy');
 	var boyHeight = $boy.height();
 	var boyWidth = $boy.width();

    //获取数据
    var getValue = function(className) {
    	var $elem = $('' + className + '');
        // 走路的路线坐标
        return {
        	height: $elem.height(),
        	top: $elem.position().top
        };
    }

	//路的Y轴
	var pathY = function(){
		var data = getValue('.a_background_middle');
		return data.top + data.height / 2; 
	}();

	//修正男孩的正确位置
	//路的中间位置减去小孩的高度，25是一个修正值
	$boy.css({
		top:pathY - boyHeight + 25
	});

	//////////////////////////////////
	/////////  动画处理   ////////////
	/////////////////////////////////


	//缓慢走路
	function slowWalk(){
		$boy.addClass("slowWalk");
	}

	//暂停走路
	function pauseWalk(){
		$boy.addClass("pauseWalk");
	}

	//恢复走路
	function restartWalk(){
		$boy.removeClass("pauseWalk");
	}

	//计算移动距离
	function calculateDist(dir,pro){
		return (dir == "x" ? visualwidth:visualheight) * pro;
	}

	//用strasition做运动
	function startRun(options,runTime){
		var dtdPlay = $.Deferred();
		//恢复走路
		restartWalk();
		//运动属性
		$boy.transition(
			options,
			runTime,
			'linear',
			function() {
				dtdPlay.resolve();
			}
		);
		return dtdPlay;
	}

	//开始走路
	function walkRun(time, distX, distY) {
		time = time || 3000;
	    // 脚动作
	    slowWalk();
	    // 开始走路
	    var d1 = startRun({
	    	'left': distX + 'px',
	    	'top': distY ? distY : undefined
	    }, time);
	    return d1;
	}

	//进入商店
	function walkToShop(runTime){
		var defer = $.Deferred();
		var doorObj = $('.door');

		//门的坐标
		var offsetDoor = doorObj.offset();
		var offsetDoorLeft = offsetDoor.left;
		console.log(doorObj);
		//男孩当前的坐标
		var offsetBoy = $boy.offset();
		var offsetBoyLeft = offsetBoy.left;

		//需要移动的坐标
		instanceX = (offsetDoorLeft + doorObj.width()/2 ) - ( offsetBoyLeft + $boy.width()/2);

		//开始走路
		var walkPlay  = startRun({
			transform:'translateX(' + instanceX + 'px),scale(0.3,0.3)',
			opacity:0.1
		},runTime);

		//走路结束
		walkPlay.done(function(){
			$boy.css({
				opacity:0
			})
			defer.resolve();
		});
		return defer;
	}
    
    //走出商店
    function walkOutShop(runTime){
    	var defer = $.Deferred();
    	restartWalk();
    	//开始走路
		var walkPlay = startRun({
		    transform: 'translateX(' + instanceX + 'px),scale(1,1)',
		    opacity: 1
		}, runTime);
		//走路完毕
		walkPlay.done(function() {
		    defer.resolve();
		});
		return defer;
    }

    //取花
    function takeFlower(){
    	var defer = $.Deferred();
    	setTimeout(function(){
    		$boy.addClass('flowerWalk');
    		defer.resolve();
    	},1000);
    	return defer;
    }

	return {
        // 开始走路
        walkTo: function(time, proportionX, proportionY) {
            var distX = calculateDist('x', proportionX)
            var distY = calculateDist('y', proportionY)
            return walkRun(time, distX, distY);
        },
        // 走进商店
        toShop: function() {
            return walkToShop.apply(null, arguments);
        },
        takeFlower:function(){
        	return takeFlower();
        },
        // 走出商店
        outShop: function() {
            return walkOutShop.apply(null, arguments);
        },
        // 停止走路
        stopWalk: function() {
            pauseWalk();
        }

    }
}

/** 
* 
* 门的动画处理
* 
*/
function doorAction(left,right,time){
	var $door = $('.door');
	var $doorLeft = $('.door-left');
	var $doorRight = $('.door-right');
	var defer = $.Deferred();
	var count = 2;
	//等待门开完成
	var complete = function (){
		if (count === 1) {
			defer.resolve();
			return;
		}
		count --;
	};
	$doorLeft.transition({'left':left},time,complete);
	$doorRight.transition({'left':right},time,complete);
	return defer;
}
//门开
function openDoor(){
	return doorAction('-50%','100%',2000);
}
//门关
function shutDoor(){
	return doorAction('0%','50%',2000);
}

/**
*灯的闪烁处理
*
*/
var lamp = {
	elem1: $(".b_background_dark"),
	elem2: $(".b_background_bright"),
	bright: function(){
		this.elem1.addClass('hide');
		this.elem2.removeClass('hide');
	},
	dark: function(){
		this.elem1.removeClass('hide');
		this.elem2.addClass('hide');
	}
}
