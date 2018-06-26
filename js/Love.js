/**
 * 小孩走路
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

	//修正小男孩的正确位置
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

	return {
        // 开始走路
        walkTo: function(time, proportionX, proportionY) {
            var distX = calculateDist('x', proportionX)
            var distY = calculateDist('y', proportionY)
            return walkRun(time, distX, distY);
        },
        // 停止走路
        stopWalk: function() {
            pauseWalk();
        },
        setColoer:function(value){
            $boy.css('background-color',value)
        }
    }
}





