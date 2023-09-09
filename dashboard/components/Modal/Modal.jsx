import React from "react";
import { createPortal } from "react-dom";

export class Modal extends React.Component {
  constructor(props) {
    super(props);
    this.dialogRef = React.createRef();
  }

  handleClickOutside(event) {
    const modalBox = event.target;
    if (!this.dialogRef?.current?.contains(modalBox) && this.props.isOpen) {
      this.props.onClose(false);
    }
  }

  handleKeydown(ev) {
    if (ev.key === "Escape") {
      this.props.onClose(false);
    }
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.isOpen && this.props.isOpen) {
      this.dialogRef?.current?.focus();
    }
  }

  render() {
    let portalRoot = document.getElementById("modal");
    if (!portalRoot) {
      portalRoot = document.createElement("div");
      portalRoot.setAttribute("id", "modal");
      document.body.appendChild(portalRoot);
    }
    const displayClass = this.props.isOpen ? "modal-show" : "modal-hide";

    return createPortal(
      <div
        id="modal-comp"
        className={displayClass}
        isOpen={this.props.isOpen}
        onKeyDown={(e) => this.handleKeydown(e)}
        onClick={(e) => this.handleClickOutside(e)}
      >
        <div
          className="dialog"
          ref={this.dialogRef}
          tabIndex={1}
          onKeyDown={(e) => this.handleKeydown(e)}
        >
          <div className="modal-title-container">
            <div className="modal-title">{this.props.title}</div>
            <Close
              className="clickable icon"
              onClick={this.props.onClose}
            />
          </div>
          {this.props.children}
        </div>
      </div>,
      portalRoot
    );
  }
}

function Close(props) {
  return (
    <svg className="close" viewBox="0 0 24 24" {...props}>
      <path
        fillRule="evenodd"
        d="M13.414 12l5.657-5.657a.999.999 0 10-1.414-1.414L12 10.586 6.343 4.929a1 1 0 00-1.414 1.414L10.586 12 4.93 17.657a1 1 0 001.414 1.414L12 13.414l5.657 5.657a.997.997 0 001.414 0 .999.999 0 000-1.414L13.414 12z"
      />
    </svg>
  );
}

Modal.defaultProps = {
  isOpen: false,
  onClose: () => {},
  title: "",
};
