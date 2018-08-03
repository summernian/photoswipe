# photoswipe

[预览demo](https://summernian.github.io/photoswipe/01.PhotoSwipe%E7%9A%84%E4%BD%BF%E7%94%A8/index.html)

##### PhotoSwipe的使用

- Html主体框架部分，部分按钮不用可注释掉

```
<div class="pswp" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="pswp__bg"></div>
    <div class="pswp__scroll-wrap">
        <div class="pswp__container">
            <div class="pswp__item"></div>
            <div class="pswp__item"></div>
            <div class="pswp__item"></div>
        </div>

        <div class="pswp__ui pswp__ui--hidden">
            <div class="pswp__top-bar">
                <div class="pswp__counter"></div>
                <button class="pswp__button pswp__button--close" title="Close (Esc)"></button>
                <button class="pswp__button pswp__button--share" title="Share"></button>
                <button class="pswp__button pswp__button--fs" title="Toggle fullscreen"></button>
                <button class="pswp__button pswp__button--zoom" title="Zoom in/out"></button>
                <div class="pswp__preloader">
                    <div class="pswp__preloader__icn">
                        <div class="pswp__preloader__cut">
                            <div class="pswp__preloader__donut"></div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap">
                <div class="pswp__share-tooltip"></div>
            </div>
            <button class="pswp__button pswp__button--arrow--left" title="Previous (arrow left)">
            </button>
            <button class="pswp__button pswp__button--arrow--right" title="Next (arrow right)">
            </button>

            <div class="pswp__caption">
                <div class="pswp__caption__center"></div>
            </div>
        </div>
    </div>
</div>
```

- 缩略图部分，样式自设
```
<div class="my-gallery" data-pswp-uid="1">
        <figure>
            <div class="img-dv"><a href="timg3.jpg" data-size="1920x1080"><img src="timg3.jpg"></a></div>
            <figcaption style="display:none;">1.海滩</figcaption>
        </figure>
        <figure>...</figure>
</div>
```
> js部分见文件夹js/PhotoswipeMove.js

- 自定义部分
```
 function openPhotoSwipe(items) {
    var pswpElement = document.querySelectorAll('.pswp')[0];
    var options = {
        tapToClose: true,
        showAnimationDuration: 0,
        hideAnimationDuration: 0
    };
    var gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
    gallery.init();
}
```
> 传入items数据，{src,w,h,title}，由事件触发；
> ps: 点击展示大图后，默认背景层透明度1，纯黑色，调整要修改原JS文件，在photoswipe.min.js or其他的文件中按Ctrl+F，搜索关键字“bg”,后面有条属性是opacity就是，改成自己想要的透明图，该条属性有且只有一个，全局~
