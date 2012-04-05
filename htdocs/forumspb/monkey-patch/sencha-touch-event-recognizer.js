Ext.event.recognizer.SingleTouch.prototype.onTouchStart = function (e) {
    var touches = e.targetTouches,
        touchesCount = touches.length;

    if (touchesCount > 1) {
        return this.fail(this.self.NOT_SINGLE_TOUCH);
    }
};

Ext.event.recognizer.MultiTouch.prototype.onTouchStart = function (e) {
    var touches = e.targetTouches,
        touchesCount = touches.length;

    if (touchesCount === this.requiredTouchesCount) {
        this.start(e);
    }
	else if (touchesCount > this.requiredTouchesCount) {
        this.end(e);
    }
};