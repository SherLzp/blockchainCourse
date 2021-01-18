import React, {Component} from 'react';
import './slider.css'

export default class Slider extends Component {
    constructor() {
        super();
        this.state = {
            nowScroll: 0
        }
    }
    handleClick(index) {
        let n = index - this.state.nowScroll;
        //clearInterval(this.interval);
        this.scroll(n);
        // this.goPlay();

    }
    scroll(num) {
        let next = this.state.nowScroll + num;
        console.log(next);
        console.log(this.state.nowScroll);
        if (next >= this.props.Imgs.length) {
            return this.setState({nowScroll: 0})
        }
        if (next < 0) {
            return this.setState({
                nowScroll: this.props.Imgs.length - 1
            })
        }

        return this.setState({nowScroll: next})
    }

    render() {
        let liwidth = 100 / this.props.Imgs.length + "%";
        console.log(liwidth);

        let styles = {
            ul: {
                width: this.props.Imgs.length*100 + '%',
                left: -this.state.nowScroll*100 + '%'
            }
        }
        console.log(styles.ul);
        return (
            <div className='slider-wrap'>
                <ul style={styles.ul}>
                    {this
                        .props
                        .Imgs
                        .map((x) => <li
                            key={Math.random()}
                            style={{
                            width: liwidth,
                            backgroundImage: `url(${x})`
                        }}></li>)}
                </ul>
                <button
                    className='arrow left'
                    onClick={this
                    .handleClick
                    .bind(this, this.state.nowScroll - 1)}>
                    &lt;
                </button>
                <button
                    className='arrow right'
                    onClick={this
                    .handleClick
                    .bind(this, this.state.nowScroll + 1)}>
                    &gt;
                </button>
                <div className='dotted'>
                 {
            this.props.Imgs.map( (item,index) =>
            <span key={Math.random()} onClick={this.handleClick.bind(this,index)}
              style={{backgroundColor: this.state.nowScroll===index ? '#fff' : '#888' }}></span> )
          }
                </div>
            </div>
        );
    }
}