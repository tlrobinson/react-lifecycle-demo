import React from "react";
import ReactDOM from "react-dom";

class LifecycleDemoBase extends React.Component {
  constructor(props) {
    super(props);
    console.group("Mounting");
    console.log("constructor");
    this.state = { state: 0 };
    setTimeout(() => {
      console.group("Updating: setState()");
      this.setState({ state: this.state.state + 1 });
    }, 100);

    setTimeout(() => {
      console.group("Updating: forceUpdate()");
      this.forceUpdate();
    }, 300);
  }

  render() {
    console.log("render");
    return null;
  }

  componentDidMount() {
    console.log("componentDidMount");
    console.groupEnd();
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log("shouldComponentUpdate");
    return true;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    console.log("componentDidUpdate");
    console.groupEnd();
  }

  componentWillUnmount() {
    console.log("componentWillUnmount");
    console.groupEnd();
  }
}

class LifecycleDemoLegacy extends LifecycleDemoBase {
  componentWillMount() {
    console.log("componentWillMount (DEPRECATED)");
  }

  componentWillReceiveProps() {
    console.log("componentWillReceiveProps (DEPRECATED)");
  }

  componentWillUpdate(nextProps, nextState) {
    console.log("componentWillUpdate (DEPRECATED)");
  }
}

class LifecycleDemoAsync extends LifecycleDemoBase {
  static getDerivedStateFromProps(nextProps, prevState) {
    console.log("getDerivedStateFromProps");
    return {};
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    console.log("getSnapshotBeforeUpdate");
    return null;
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      prop: 0,
      Component: LifecycleDemoAsync,
    };
    console.group("Async");
    setTimeout(() => {
      console.group("Updating: New props");
      this.setState({ prop: this.state.prop + 1 });
    }, 200);
    setTimeout(() => {
      console.group("Unmount");
      this.setState({ Component: null }, () => {
        console.groupEnd();
        console.group("Legacy");
        this.setState({ Component: LifecycleDemoLegacy });
        setTimeout(() => {
          console.group("Updating: New props");
          this.setState({ prop: this.state.prop + 1 });
        }, 200);
        setTimeout(() => {
          console.group("Unmount");
          this.setState({ Component: null });
          setTimeout(() => console.groupEnd(), 100);
        }, 400);
      });
    }, 400);
  }
  render() {
    const { Component } = this.state;
    return (
      <div>
        <div>Check the developer console for logs</div>
        {Component ? <Component prop={this.state.prop} /> : null}
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
