'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _styleCss = require('./style.css');

var _styleCss2 = _interopRequireDefault(_styleCss);

var SmartSticky = (function (_Component) {
  _inherits(SmartSticky, _Component);

  _createClass(SmartSticky, null, [{
    key: 'propTypes',
    value: {
      tolerance: _react.PropTypes.number,
      children: _react.PropTypes.node
    },
    enumerable: true
  }, {
    key: 'defaultProps',
    value: {
      tolerance: 50 // ammount of scrolled pixels before sticky will start to move
    },
    enumerable: true
  }]);

  function SmartSticky(props) {
    _classCallCheck(this, SmartSticky);

    _get(Object.getPrototypeOf(SmartSticky.prototype), 'constructor', this).call(this, props);
    this.scrollInfo = {
      currentMove: 0, // ammount of pixels scrolled since last direction change
      lastScrollPosition: 0, // scroll position of previous scroll event
      lastScrollChange: 0 // difference between current event scroll position and previous one
    };
    this.state = {
      stickyPosition: 0
    };
  }

  _createClass(SmartSticky, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      // in case of server side rendering - let's attach events
      // after element is mounted in DOM (it'll not happen on server side render)
      this.handler = this._handleScroll.bind(this);
      window.addEventListener('scroll', this.handler);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      // to avoid memory leak - remove event listener when element is unmounted
      window.removeEventListener('scroll', this.handler);
    }
  }, {
    key: '_handleScroll',
    value: function _handleScroll() {
      this._updateLastScrollChange();
      this._updateCurrentMove();
      this._updateStickyPosition();
      this._updateLastScrollPosition();
    }

    /**
     * Sets number of pixels scrolled by current scroll event
     * @return {void}
     */
  }, {
    key: '_updateLastScrollChange',
    value: function _updateLastScrollChange() {
      var lastScrollPosition = this.scrollInfo.lastScrollPosition;

      this.scrollInfo.lastScrollChange = window.scrollY - lastScrollPosition;
    }

    /**
     * Set's total ammount of pixels scrolled since last change of scrolling direction
     * If direction change is detected - it'll reset this ammount
     * @return {void}
     */
  }, {
    key: '_updateCurrentMove',
    value: function _updateCurrentMove() {
      if (this._hasChangedDirection()) {
        this.scrollInfo.currentMove = 0;
      } else {
        var currentMove = this.scrollInfo.currentMove;

        this.scrollInfo.currentMove = currentMove + this._getScrollDifference();
      }
    }

    /**
     * Basing on all informations we've got, it'll update sticky bar position
     * @return {void}
     */
  }, {
    key: '_updateStickyPosition',
    value: function _updateStickyPosition() {
      var stickyPosition = this.state.stickyPosition;
      var _scrollInfo = this.scrollInfo;
      var currentMove = _scrollInfo.currentMove;
      var lastScrollChange = _scrollInfo.lastScrollChange;

      var targetDivHeight = this.refs.containerDiv.clientHeight;
      var tolerance = this.props.tolerance;

      // if move in one direction is smaller then tolerance
      if (Math.abs(currentMove) < tolerance) {
        // and sticky is not in the middle of movement (halfly hidden)
        // then do nothing
        if (stickyPosition === 0 || stickyPosition === targetDivHeight) return;
      }

      // add change of scroll position to sticky position
      var newStickyPosition = stickyPosition + lastScrollChange;

      // if change is bigger than sticky height - cap it (it cannot be 'more' hidden)
      if (newStickyPosition > targetDivHeight) newStickyPosition = targetDivHeight;
      // if sticky is fully visible - don't let it go down the screen
      if (newStickyPosition < 0) newStickyPosition = 0;
      // we set sticky position as state so element will get re-rendered
      this.setState({
        stickyPosition: newStickyPosition
      });
    }

    /**
     * Save current scroll position so it can be used later as previous
     * scroll position
     * @return {void}
     */
  }, {
    key: '_updateLastScrollPosition',
    value: function _updateLastScrollPosition() {
      this.scrollInfo.lastScrollPosition = window.scrollY;
    }

    /**
     * Returns pixels scrolled comparing to last scroll event
     * @return {int}
     */
  }, {
    key: '_getScrollDifference',
    value: function _getScrollDifference() {
      var lastScrollPosition = this.scrollInfo.lastScrollPosition;

      return window.scrollY - lastScrollPosition;
    }

    /**
     * Returns if current scroll event is in different direction to previous
     * @return {Boolean}
     */
  }, {
    key: '_hasChangedDirection',
    value: function _hasChangedDirection() {
      var scrollDifference = this._getScrollDifference();
      var currentMove = this.scrollInfo.currentMove;

      return scrollDifference > 0 && currentMove < 0 || scrollDifference < 0 && currentMove > 0;
    }
  }, {
    key: 'render',
    value: function render() {
      var children = this.props.children;
      var stickyPosition = this.state.stickyPosition;

      return _react2['default'].createElement(
        'div',
        { className: _styleCss2['default'].sticky, ref: 'containerDiv', style: { top: -stickyPosition } },
        children
      );
    }
  }]);

  return SmartSticky;
})(_react.Component);

exports['default'] = SmartSticky;
module.exports = exports['default'];