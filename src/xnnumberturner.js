//! xnNumberTurner.js
//！ 仙女颜色选择器
//! https://github.com/fanaiai/xnNumberTurner
//! version : 1.0.0
//! authors : 范媛媛
//! create date:2021/03/05
//! update date:2021/03/19 发布
import './xnquery.js'
import './xnnumberturner.css'

(function (window, $) {
    var option = {
        type: 'linerUp',//
        // linerUp：匀速向上翻转，sameTimeUp：总时间相同向上翻转，linerChange:匀速数字变化，sameTimeChange:总时长相同数字变化,easyChange
        css: {
            height: 40,
            backgroundColor: '#efefef',
            borderColor: '#125ce9',
            borderWidth: 2,
            borderStyle: 'solid',
            backgroundImage: '',
            backgroundSize: 'auto',
            width: 30,
            textAlign: 'center',
            marginRight: 4,
            borderRadius: 4,
            fontSize: 22,
            fontFamily: '苹方,微软雅黑',//unidreamLED
            color: 'rgb(11 59 235)'
        },
        animate: {
            speedTimeLength: 2,
            sleepTime: 10,
            totalTime: 1000,//总时长
        }
    }

    function XNNumberTuner(dom, options) {
        this.option = $.extend(true, {}, option, options);
        this.dom = dom;
        this.arry = String(this.option.number).split('').reverse();//最新数组

        this.initArry = new Array(this.arry.length);//初始数组
        this.option.css.height=parseInt(this.option.css.height);
        this.currentNumber = 0;
        this.rids=[];
        this.eventList={};
        this[this.option.type]()
    }

    XNNumberTuner.prototype = {
        sameTimeChange() {
            this._initLinerChangDom();
            this.sameTimeChangeFunc();
        },
        sameTimeChangeFunc() {
            var totalChangeNumbers = 0;
            for (let i = 0; i < this.arry.length; i++) {
                if (this.arry[i] != this.initArry[i] && $.isNumber(this.arry[i])) {
                    totalChangeNumbers += Math.abs(this.arry[i] - (this.initArry[i] || 0))
                }
            }
            var speed = parseInt(this.option.animate.totalTime / totalChangeNumbers);
            var i = 0;
            this.sameTimeChangeturnNumber(this.arry[i], i, speed)
            this.lastArry=this.arry;
        },
        sameTimeChangeUpdate() {
            if (this.arry.length == this.lastArry.length) {
                this.sameTimeChangeFunc();
            } else {
                this.sameTimeChange();
            }
        },
        linerChange() {
            this._initLinerChangDom();
            for (let i = 0; i < this.arry.length; i++) {
                this.linerChangeturnNumber(this.arry[i], i)
            }
            this.lastArry=this.arry;
        },
        linerChangeUpdate(){
            if (this.arry.length == this.lastArry.length) {
                for (let i = 0; i < this.arry.length; i++) {
                    this.linerChangeturnNumber(this.arry[i], i)
                }
            } else {
                this.linerChange();
            }
        },
        sameTimeUp() {
            this.init();
        },
        sameTimeUpUpdate(){
            if (this.arry.length == this.lastArry.length) {
                for (let i = 0; i < this.arry.length; i++) {
                    this.turnNumber(this.arry[i], i)
                }
            } else {
                this.init();
            }
        },
        linerUp() {
            this.init();
        },
        linerUpUpdate() {
            if (this.arry.length == this.lastArry.length) {
                // for (let i = 0; i < this.arry.length; i++) {
                //     this.turnNumber(this.arry[i], i)
                // }
                // for (let i = 0; i < this.arry.length; i++) {
                //     this.turnNumber(this.arry[i], i)
                // }
                if(this.isrunning>0){
                    return;
                }
                this.isrunning=0;
                for (let i = 0; i < this.arry.length; i++) {
                    if (!$.isNumber(this.arry[i])) {
                        continue;
                    }
                    else{
                        this.isrunning++;
                    }
                }
                for (let i = 0; i < this.arry.length; i++) {
                    if (!$.isNumber(this.arry[i])) {
                        continue;
                    }
                    this.turnNumber(this.arry[i], i)
                }
            } else {
                this.init();
            }
        },
        easyChange() {
            this.initDom();
            this.easyChangeturnAnimate(this.cont, this.option.number)
        },
        init: function () {
            this.initDom();
            var innerHtml = '';
            var numberlist = '';
            for (let i = 0; i < 10; i++) {
                numberlist += `<p class="number${i} ${i == 0 ? 'current-number' : ''}">${i}</p>`
            }
            for (let i = 0; i < this.arry.length; i++) {
                let t = numberlist;
                let itemclass='';
                if (!$.isNumber(this.arry[i])) {
                    itemclass='not-number'
                    t = `<p>${this.arry[i]}</p>`;
                }
                innerHtml += `
        <div class="number-turner-item ${itemclass}" data-key="${i}"><div>${t}</div></div>
        `
            }
            this.cont.innerHTML = innerHtml;
            this.isrunning=0;
            for (let i = 0; i < this.arry.length; i++) {
                if (!$.isNumber(this.arry[i])) {
                    continue;
                }
                else{
                    this.isrunning++;
                }
            }
            for (let i = 0; i < this.arry.length; i++) {
                if (!$.isNumber(this.arry[i])) {
                    continue;
                }
                this.turnNumber(this.arry[i], i)
            }
            this.setItemCss();
            this.lastArry = this.arry;
        },
        _initLinerChangDom() {
            this.initDom();
            var innerHtml = '';
            for (let i = 0; i < this.arry.length; i++) {
                let t = `<p>${$.isNumber(this.arry[i]) ? 0 : this.arry[i]}</p>`;
                innerHtml += `
        <div class="number-turner-item" data-key="${i}"><div>${t}</div></div>
        `
            }
            this.cont.innerHTML = innerHtml;
            this.setItemCss();
        },
        initDom() {
            this.dom.innerHTML = '';
            this.cont = document.createElement('div');
            this.cont.classList.add('xnnumbertruner');
            this.dom.appendChild(this.cont);
        },
        setItemCss() {
            this.dom.querySelectorAll('.number-turner-item').forEach((ele) => {
                $.setCss(ele, this.option)
            })
        },

        easyChangeturnAnimate(cont, totalnumber) {
            var currentNumber = this.currentNumber;
            var decimal = this._getDecimalLength(totalnumber)
            let step = 1 / (Math.pow(10, decimal))
            let speed = this.option.animate.totalTime * step / totalnumber.replace(',', '');
            let interval = window.setInterval(() => {
                currentNumber = parseFloat(currentNumber) + step
                currentNumber = currentNumber.toFixed(decimal);
                var innerHtml = '';
                let arry = String(currentNumber).split('')
                for (let i = arry.length - 1; i >= 0; i--) {
                    let t = `<p>${arry[i]}</p>`;
                    innerHtml += `
        <div class="number-turner-item" data-key="${i}"><div>${t}</div></div>
        `
                }
                cont.innerHTML = innerHtml;
                this.setItemCss();
                if (parseFloat(currentNumber) >= parseFloat(this.option.number.replace(',', ''))) {
                    clearInterval(interval)
                }
            }, speed)

        },
        sameTimeChangeturnNumber(dirnum, key, speed) {
            if (!$.isNumber(dirnum)) {
                key++;
                dirnum = this.arry[key]
                this.sameTimeChangeturnNumber(dirnum, key, speed)
            }
            let dom = this.dom.querySelector(".number-turner-item[data-key='" + key + "']>div")
            let currentIndex = parseInt(dom.querySelector('p').innerHTML);
            let turnStep = dirnum - currentIndex;
            let dir = turnStep > 0 ? 1 : -1;
            this['sameTimeChangeturnAnimate'](dom, currentIndex, dir, dirnum, speed, key);
        },
        linerChangeturnNumber(dirnum, key) {
            if (!$.isNumber(dirnum)) {
                return;
            }
            let dom = this.dom.querySelector(".number-turner-item[data-key='" + key + "']>div")
            let currentIndex = parseInt(dom.querySelector('p').innerHTML);
            let turnStep = dirnum - currentIndex;
            let dir = turnStep > 0 ? 1 : -1;
            this['linerChangeturnAnimate'](dom, turnStep, currentIndex, dir, dirnum);
        },
        turnNumber(dirnum, key) {

            let dom = this.dom.querySelector(".number-turner-item[data-key='" + key + "']>div")
            let currentIndex = parseInt(dom.querySelector(".current-number").innerHTML);
            let turnStep = currentIndex - dirnum;
            turnStep=turnStep==0?10:turnStep;
            console.log(turnStep);
            let dir = turnStep > 0 ? 1 : -1;
            let curTime=new Date().getTime();
            this[this.option.type + 'turnAnimate'](dom, turnStep, currentIndex, dir, dirnum,curTime,curTime);
        },
        sameTimeChangeturnAnimate(dom, currentIndex, dir, dirnum, speed, key) {
            if (currentIndex == dirnum) {
                let i = key + 1;
                if (i < this.arry.length) {
                    this.sameTimeChangeturnNumber(this.arry[i], i, speed);
                } else {
                    this.initArry = this.arry;
                }
                return;
            }
            let curNumber = parseInt(currentIndex)
            window.setTimeout(() => {
                curNumber += dir
                dom.querySelector("p").innerHTML = curNumber;
                if (curNumber != dirnum) {
                    this.sameTimeChangeturnAnimate(dom, curNumber, dir, dirnum, speed, key);
                } else {
                    let i = key + 1;
                    if (i < this.arry.length) {
                        this.sameTimeChangeturnNumber(this.arry[i], i, speed);
                    } else {
                        this.initArry = this.arry;
                    }
                }
            }, speed)
        },
        linerChangeturnAnimate(dom, turnStep, currentIndex, dir, dirnum) {
            if (currentIndex == dirnum) {
                return;
            }
            let curNumber = parseInt(currentIndex)
            window.setTimeout(() => {
                curNumber += dir
                dom.querySelector("p").innerHTML = curNumber;
                if (curNumber != dirnum) {
                    this.linerChangeturnAnimate(dom, turnStep, curNumber, dir, dirnum);
                }
            }, this.option.animate.totalTime / 10)
        },
        getTransform(t){
            let translate = document.defaultView.getComputedStyle(t,null).transform.split(', ')
            let top = parseFloat(translate[translate.length - 1])||0;
            return top;
        },
        setTransform($t,translateTop){
            // console.log(translateTop);
            $t.css({transform: 'translateY(' + translateTop + 'px)'})
        },
        linerUpturnAnimate(dom, turnStep, currentIndex, dir, dirnum,cursleepTime,curTime) {
            // return;
            // if (currentIndex == dirnum) {
            //
            // }
            var curHeight=0;
            var rid=null;
            var dirStep=currentIndex - dirnum;
            var animate1=()=>{
                // this.isrunning=true;
                if (currentIndex == dirnum) {
                    cancelAnimationFrame(rid)
                    this.isrunning--;
                    if(this.isrunning<=0 && rid){
                        this.trigger('update');
                    }
                    return;
                }
                var sleepTimeLength=new Date().getTime()-cursleepTime;
                if(sleepTimeLength>=this.option.animate.sleepTime){
                    var timeLength=sleepTimeLength-this.option.animate.sleepTime;
                    curHeight+=parseInt(this.option.animate.step);
                    let top=this.getTransform(dom)
                    var curheight=parseInt(top) + parseInt(this.option.animate.step)*dir;
                    // dom.style.top = curheight + 'px';
                    // console.log(curheight);
                    this.setTransform($(dom),curheight)
                        if (curHeight >= this.option.css.height) {
                            // dom.style.top = curheight+(curHeight-this.option.css.height) + 'px';
                            this.setTransform($(dom),curheight+(curHeight-this.option.css.height))
                            cursleepTime=new Date().getTime();
                            curTime=new Date().getTime()
                            curHeight=0;
                            // clearInterval(interval)
                            currentIndex -= dir;
                            if (currentIndex != dirnum) {
                                // this.linerUpturnAnimate(dom, turnStep, currentIndex, dir, dirnum);
                            } else {
                                // dom.style.top = -(dirnum*this.option.css.height) + 'px';
                                this.setTransform($(dom),-(dirnum*this.option.css.height))
                                dom.querySelector(".current-number").classList.remove("current-number");
                                dom.querySelector(".number" + dirnum).classList.add("current-number");
                            }
                        }
                }
                rid=requestAnimationFrame(animate1)
            }
            animate1()
            // window.setTimeout(() => {
            //     let curheight = 0
            //     let interval = window.setInterval(() => {
            //         dom.style.top = parseInt(dom.style.top || 0) + dir + 'px';
            //         curheight++;
            //         if (curheight >= this.option.css.height) {
            //             clearInterval(interval)
            //             currentIndex -= dir;
            //             if (currentIndex != dirnum) {
            //                 this.linerUpturnAnimate(dom, turnStep, currentIndex, dir, dirnum);
            //             } else {
            //                 dom.querySelector(".current-number").classList.remove("current-number");
            //                 dom.querySelector(".number" + dirnum).classList.add("current-number")
            //             }
            //         }
            //     }, this.option.animate.speedTimeLength)
            //
            // }, this.option.animate.sleepTime)

        },
        sameTimeUpturnAnimate(dom, turnStep, currentIndex, dir, dirnum) {
            if (currentIndex == dirnum) {
                return;
            }
            let curheight = 0;
            let dirHeight = (Math.abs(turnStep) * this.option.css.height);
            let speed = this.option.animate.totalTime / dirHeight;
            let interval = window.setInterval(() => {
                dom.style.top = parseInt(dom.style.top || 0) + dir + 'px';
                curheight++;
                if (curheight >= dirHeight) {
                    clearInterval(interval)
                    dom.querySelector(".current-number").classList.remove("current-number");
                    dom.querySelector(".number" + dirnum).classList.add("current-number")
                }
            }, speed)
        },
        updateNumber(number) {
            let newArry = String(number).split('').reverse();
            this.arry = newArry;
            console.log(this.isrunning)
            if(this.isrunning>0){
                this.on('update',this[this.option.type + 'Update'].bind(this),true)
            }
            else{
                this[this.option.type + 'Update']();
            }
        },
        _getDecimalLength(n) {
            return n.toString().split(".")[1] ? n.toString().split(".")[1].length : 0;
        },
        on: function (type, func, refresh) {
            if (!this.eventList[type]) {
                this.eventList[type] = {
                    listener: [func]
                }
            } else {
                if (refresh) {
                    this.eventList[type].listener = [func]
                } else {
                    this.eventList[type].listener.push(func)
                }
            }
        },
        trigger: function (type) {
            if (!this.eventList[type]) {
                return;
            }
            for (let i = 0; i < this.eventList[type].listener.length; i++) {
                let listener = this.eventList[type].listener[i];
                if (typeof listener == 'function') {
                    listener(arguments[1], this.dom)
                }
            }
        },

    }
    window.XNNumberTuner = XNNumberTuner;
})(window, XNQuery)
