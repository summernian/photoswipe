
/*

    PhotoSwipe提供了丰富的选项设置，可以满足各种开发需求。以下列举一些常用的options选项：

    index：开始的滑块（图片），必须为数字，默认0（第一张）

    showHideOpacity：当调用时是否展示透明度和比例变化动画，默认false。

    showAnimationDuration：展示动画过渡时间，默认333，数字。

    hideAnimationDuration：隐藏动画过渡间隔时间，默认333，数字。

    fullscreenEl : false,是否支持全屏按钮

    shareButtons: [
            {id:'weibo', label:'新浪微博', url:'#'},
            {id:'download', label:'保存图片', url:'{{raw_image_url}}', download:true}
        ], // 分享按钮

    getThumbBoundsFn: function(index) {
             // See Options -> getThumbBoundsFn section of documentation for more info
             var thumbnail = items[index].el.getElementsByTagName('img')[0], // find thumbnail
                 pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
                 rect = thumbnail.getBoundingClientRect();

            return {x:rect.left, y:rect.top + pageYScroll, w:rect.width};
        }

    maxSpreadZoom：最大放大倍数。

    loop：是否循环展示图片，当左右滑动图片时。

    closeOnScroll：在页面上滚动关闭图集， 仅适用于没有硬件触摸支持的设备。

    escKey：是否可以使用Esc键关闭图集，默认true。

    arrowKeys：是否可以使用左右方向键导航切换，默认true。

    history：是否使用history模式，默认true，历史记录模式支持url返回。

    galleryUID：当多个图集时，用来表示某个图集，默认1，数字，URL会变成http://example.com/#&gid=1&pid=2

    galleryPIDs：表示某一张图片，配合图集galleryUID一起使用。

    preload：预加载，数组，默认[1,1]，是指在切换图片时，预先懒加载前后图片的张数，不能小于1。

*/

//以下是已经写好的函数部分，如无必要不需改动，可以直接引用。

var initPhotoSwipeFromDOM = function(gallerySelector) {

    var parseThumbnailElements = function(el) {
        var thumbElements = el.childNodes,
            numNodes = thumbElements.length,
            items = [],
            figureEl,
            linkEl,
            size,
            item;

        for (var i = 0; i < numNodes; i++) {
            figureEl = thumbElements[i]; // <figure> element
            // 仅包括元素节点
            if (figureEl.nodeType !== 1) {
                continue;
            }
            linkEl = figureEl.children[0]; // <a> parent element

            size = linkEl.children[0].getAttribute('data-size').split('x');

            //console.log(figureEl,linkEl,size);

            // 创建幻灯片对象
            item = {
                src: linkEl.children[0].getAttribute('href'),
                w: parseInt(size[0], 10),
                h: parseInt(size[1], 10)
            };
            if (figureEl.children.length > 1) {
                // <figcaption> content
                item.title = figureEl.children[1].innerHTML;
            }
            if (linkEl.children.length > 0) {
                // <img> 缩略图节点, 检索缩略图网址
                item.msrc = linkEl.children[0].getAttribute('src');
            }
            item.el = figureEl; // 保存链接元素 for getThumbBoundsFn
            items.push(item);
        }

        console.log(items);
        return items;
    };

    // 查找最近的父节点
    var closest = function closest(el, fn) {
        return el && ( fn(el) ? el : closest(el.parentNode, fn) );
    };

    // 当用户点击缩略图触发
    var onThumbnailsClick = function(e) {

        e = e || window.event;
        e.preventDefault ? e.preventDefault() : e.returnValue = false;

        var eTarget = e.target || e.srcElement;

        // find root element of slide
        var clickedListItem = closest(eTarget, function (el) {
            return (el.tagName && el.tagName.toUpperCase() === 'FIGURE');
        });
        if (!clickedListItem) {
            return;
        }

        // find index of clicked item by looping through all child nodes
        // alternatively, you may define index via data- attribute
        var clickedGallery = clickedListItem.parentNode,
            childNodes = clickedListItem.parentNode.childNodes,
            numChildNodes = childNodes.length,
            nodeIndex = 0,
            index;

        for (var i = 0; i < numChildNodes; i++) {
            if (childNodes[i].nodeType !== 1) {
                continue;
            }
            if (childNodes[i] === clickedListItem) {
                index = nodeIndex;
                break;
            }

            nodeIndex++;
        }

        if(index >= 0) {
            // open PhotoSwipe if valid（有效的） index found
            openPhotoSwipe( index, clickedGallery );
        }
        return false;
    };

    // parse（解析） picture index and gallery index from URL (#&pid=1&gid=2)
    var photoswipeParseHash = function() {

        var hash = window.location.hash.substring(1),
            params = {};

        if (hash.length < 5) {
            return params;
        }

        var vars = hash.split('&');
        for (var i = 0; i < vars.length; i++) {
            if (!vars[i]) {
                continue;
            }
            var pair = vars[i].split('=');
            if (pair.length < 2) {
                continue;
            }
            params[pair[0]] = pair[1];
        }

        if (params.gid) {
            params.gid = parseInt(params.gid, 10);
        }

        return params;
    };

    var openPhotoSwipe = function(index, galleryElement, disableAnimation, fromURL) {
        var pswpElement = document.querySelectorAll('.pswp')[0],
            gallery,
            options,
            items;

        items = parseThumbnailElements(galleryElement);
        // 这里可以定义参数
        options = {
            barsSize: {
                top: 100,
                bottom: 100
            },

            fullscreenEl : true, // 是否支持全屏按钮

            shareButtons: [
                {id: 'wechat', label: '分享微信', url: '#'},
                {id: 'weibo', label: '新浪微博', url: '#'},
                {id: 'download', label: '保存图片', url: '{{raw_image_url}}', download: true}
            ], // 分享按钮

            // define gallery index (for URL)
            galleryUID: galleryElement.getAttribute('data-pswp-uid'),

            getThumbBoundsFn: function (index) {
                // See Options -> getThumbBoundsFn section of documentation for more info
                var thumbnail = items[index].el.getElementsByTagName('img')[0], // find thumbnail
                    pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
                    rect = thumbnail.getBoundingClientRect();
                return {x: rect.left, y: rect.top + pageYScroll, w: rect.width};
            }
        };

        // PhotoSwipe opened from URL
        if(fromURL) {

            if(options.galleryPIDs) {

                // parse real index when custom PIDs are used
                for(var j = 0; j < items.length; j++) {

                    if(items[j].pid == index) {
                        options.index = j;
                        break;
                    }
                }

            } else {

                // in URL indexes start from 1
                options.index = parseInt(index, 10) - 1;

            }

        } else {
            options.index = parseInt(index, 10);
        }

        // exit if index not found
        if( isNaN(options.index) ) {
            return;
        }

        if(disableAnimation) {
            options.showAnimationDuration = 0;
        }

        // Pass data to PhotoSwipe and initialize it
        gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);
        gallery.init();

    };

    // loop through all gallery elements and bind events
    var galleryElements = document.querySelectorAll( gallerySelector );

    for(var i = 0, l = galleryElements.length; i < l; i++) {
        galleryElements[i].setAttribute('data-pswp-uid', i+1);
        galleryElements[i].onclick = onThumbnailsClick;
    }

    // Parse URL and open gallery if it contains #&pid=3&gid=1
    var hashData = photoswipeParseHash();
    if(hashData.pid && hashData.gid) {
        openPhotoSwipe( hashData.pid ,  galleryElements[ hashData.gid - 1 ], true, true );
    };

};

// execute above function
initPhotoSwipeFromDOM('.my-gallery');