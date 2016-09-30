import React, {Component, PropTypes} from 'react';


export default class SmartSticky extends Component {
  static propTypes = {
    tolerance: PropTypes.number,
    children: PropTypes.node
  }

  static defaultProps = {
    tolerance: 50 // ammount of scrolled pixels before sticky will start to move
  }

  constructor(props) {
    super(props);
    this.scrollInfo = {
      currentMove: 0, // ammount of pixels scrolled since last direction change
      lastScrollPosition: 0, // scroll position of previous scroll event
      lastScrollChange: 0 // difference between current event scroll position and previous one
    };
    this.state = {
      stickyPosition: 0
    };
  }

  componentDidMount() {
    // in case of server side rendering - let's attach events
    // after element is mounted in DOM (it'll not happen on server side render)
    this.handler = this._handleScroll.bind(this);
    window.addEventListener('scroll', this.handler);
  }

  componentWillUnmount() {
    // to avoid memory leak - remove event listener when element is unmounted
    window.removeEventListener('scroll', this.handler);
  }

  _handleScroll() {
    this._updateLastScrollChange();
    this._updateCurrentMove();
    this._updateStickyPosition();
    this._updateLastScrollPosition();
  }

  /**
   * Sets number of pixels scrolled by current scroll event
   * @return {void}
   */
  _updateLastScrollChange() {
    const {lastScrollPosition} = this.scrollInfo;
    this.scrollInfo.lastScrollChange = window.scrollY - lastScrollPosition;
  }

  /**
   * Set's total ammount of pixels scrolled since last change of scrolling direction
   * If direction change is detected - it'll reset this ammount
   * @return {void}
   */
  _updateCurrentMove() {
    if ( this._hasChangedDirection() ) {
      this.scrollInfo.currentMove = 0;
    } else {
      const {currentMove} = this.scrollInfo;
      this.scrollInfo.currentMove = currentMove + this._getScrollDifference();
    }
  }

  /**
   * Basing on all informations we've got, it'll update sticky bar position
   * @return {void}
   */
  _updateStickyPosition() {
    const {stickyPosition} = this.state;
    const {currentMove, lastScrollChange} = this.scrollInfo;
    const targetDivHeight = this.refs.containerDiv.clientHeight;
    const {tolerance} = this.props;

    // if move in one direction is smaller then tolerance
    if ( Math.abs(currentMove) < tolerance ) {
      // and sticky is not in the middle of movement (halfly hidden)
      // then do nothing
      if ( stickyPosition === 0 || stickyPosition === targetDivHeight ) return;
    }

    // add change of scroll position to sticky position
    let newStickyPosition = stickyPosition + lastScrollChange;

    // if change is bigger than sticky height - cap it (it cannot be 'more' hidden)
    if ( newStickyPosition > targetDivHeight ) newStickyPosition = targetDivHeight;
    // if sticky is fully visible - don't let it go down the screen
    if ( newStickyPosition < 0 ) newStickyPosition = 0;
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
  _updateLastScrollPosition() {
    this.scrollInfo.lastScrollPosition = window.scrollY;
  }

  /**
   * Returns pixels scrolled comparing to last scroll event
   * @return {int}
   */
  _getScrollDifference() {
    const {lastScrollPosition} = this.scrollInfo;
    return window.scrollY - lastScrollPosition;
  }

  /**
   * Returns if current scroll event is in different direction to previous
   * @return {Boolean}
   */
  _hasChangedDirection() {
    const scrollDifference = this._getScrollDifference();
    const {currentMove} = this.scrollInfo;
    return scrollDifference > 0 && currentMove < 0 || scrollDifference < 0 && currentMove > 0;
  }

  render() {
    const {
      children
    } = this.props;
    const {stickyPosition} = this.state;
    const style = {
      position: fixed,
      top: -stickyPosition,
      left: 0,
      right: 0,
      'z-index': 1000
    }

    return (
      <div ref="containerDiv" style={style}>
        {children}
      </div>
    );
  }
}
