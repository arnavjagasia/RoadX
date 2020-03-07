import React, { Component } from 'react';
import { Carousel, CarouselItem, CarouselIndicators, Button } from 'reactstrap';
import '../css/landing.css';

const items = [
  {
    title: 'Who We Are',
    caption:
      'We are a group dedicated to connecting people and policy. ' +
      "Whether you're a Policymaker looking to make a change " +
      "or a Patron with change to spare, we've got something here for you. " +
      'Change starts here.',
  },
  {
    title: 'How It Works',
    caption:
      'Patrons sign up for our service to donate to causes they care about. ' +
      'Policymakers can indicate policies they feel passionate about and choose topics ' +
      'that hit close to home. Our service connects people with change to people trying to make change.',
  },
  {
    title: 'Change Starts Here',
    caption: 'Ready to make change? Login or register with us!',
  },
];

class About extends Component {
  constructor(props) {
    super(props);
    this.state = { activeIndex: 0 };
    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
    this.goToIndex = this.goToIndex.bind(this);
    this.onExiting = this.onExiting.bind(this);
    this.onExited = this.onExited.bind(this);
    this.handleAbout = this.handleAbout.bind(this);
  }

  handleAbout(event) {
    this.props.switchToAbout(false);
  }

  onExiting() {
    this.animating = true;
  }

  onExited() {
    this.animating = false;
  }

  next() {
    if (this.animating) return;
    const nextIndex = this.state.activeIndex === items.length - 1 ? 0 : this.state.activeIndex + 1;
    this.setState({ activeIndex: nextIndex });
  }

  previous() {
    if (this.animating) return;
    const nextIndex = this.state.activeIndex === 0 ? items.length - 1 : this.state.activeIndex - 1;
    this.setState({ activeIndex: nextIndex });
  }

  goToIndex(newIndex) {
    if (this.animating) return;
    this.setState({ activeIndex: newIndex });
  }

  render() {
    const { activeIndex } = this.state;

    const slides = items.map(item => {
      return (
        <CarouselItem
          onExiting={this.onExiting}
          onExited={this.onExited}
          key={item.src}
          className="about-carousel"
        >
          <div className="carousel-container">
            <h2>{item.title}</h2>
            <h3 className="carousel-text">{item.caption}</h3>
          </div>
        </CarouselItem>
      );
    });

    return (
      <div>
        <Carousel activeIndex={activeIndex} next={this.next} previous={this.previous}>
          <CarouselIndicators
            items={items}
            activeIndex={activeIndex}
            onClickHandler={this.goToIndex}
          />
          {slides}
        </Carousel>
        <div className="center-row" id="learn-more">
          <Button className="about-button" onClick={this.handleAbout}>
            Back to Welcome
          </Button>
        </div>
      </div>
    );
  }
}

export default About;
