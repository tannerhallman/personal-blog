---
path: popper-and-styled-components-to-create-dropdown
date: 2021-03-06T17:24:52.438Z
title: Using usePopper and styled-components to create a practical dropdown from
  scratch
description: Creating a dropdown from scratch using popper.js and styled components.
---
# Backstory

So my team and I are trying to create our own reusable UI component library that's not based on any UI frameworks and everything was butter until we came to the dropdown component.

Dropdowns and modals are notoriously abstract because the elements in the DOM are not immediately nested. In order to have modals & dropdowns appear above all other elements (standard modal & dropdown behavior), you have to use reasonably advanced concepts. As I was looking for examples on the web, I ran into [Popper.js](https://popper.js.org/). Great! A tooltip & popover positioning library. Just what we need.

Most of the popper docs are written in pure vanilla JS. They have a very small section with limited details on using the [react-popper](https://popper.js.org/react-popper/). *I plan to PR some doc additions to the lib.* In their docs, they explain that hooks are the way forward (yay, we all love hooks... right?). So I start trying to implement the hooks example:

# [](https://dev.to/tannerhallman/using-usepopper-to-create-a-practical-dropdown-5bf8#code-story)Code Story[](<>)

### [](https://dev.to/tannerhallman/using-usepopper-to-create-a-practical-dropdown-5bf8#usepopper-documentation-example)usePopper documentation example

*borrowed straight from docs [example](https://popper.js.org/react-popper/v2/#example)*

Code:

```javascript
port React, { useState } from "react";
import { usePopper } from "react-popper";

const Example = () => {
  const [referenceElement, setReferenceElement] = useState(null);
  const [popperElement, setPopperElement] = useState(null);
  const [arrowElement, setArrowElement] = useState(null);
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    modifiers: [{ name: "arrow", options: { element: arrowElement } }]
  });

  return (
    <>
      <button type="button" ref={setReferenceElement}>
        Reference element
      </button>

      <div ref={setPopperElement} style={styles.popper} {...attributes.popper}>
        Popper element
        <div ref={setArrowElement} style={styles.arrow} />
      </div>
    </>
  );
};

export default Example;
```

Output:

\
<iframe src="https://codesandbox.io/embed/1-react-popper-vanilla-mnm2b?fontsize=14&hidenavigation=1&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="1-react-popper-vanilla"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

Even though styles are missing, I understand that the default docs example should be as vanilla as possible. This example doesn't visually do anything. So I tried to implement this.

### [](https://dev.to/tannerhallman/using-usepopper-to-create-a-practical-dropdown-5bf8#docs-converted-to-dropdown)Docs converted to dropdown

Code:

```javascript
import React, { useState } from "react";
import { usePopper } from "react-popper";

import DropdownContainer from "./components/DropdownContainer";
import DropdownItem from "./components/DropdownItem";

function Dropdown(props) {
  const [visible, setVisibility] = useState(false);

  const [referenceRef, setReferenceRef] = useState(null);
  const [popperRef, setPopperRef] = useState(null);

  const { styles, attributes } = usePopper(referenceRef, popperRef, {
    placement: "bottom",
    modifiers: [
      {
        name: "offset",
        enabled: true,
        options: {
          offset: [0, 10]
        }
      }
    ]
  });

  function handleDropdownClick(event) {
    setVisibility(!visible);
  }

  return (
    <React.Fragment>
      <button ref={setReferenceRef} onClick={handleDropdownClick}>
        Click Me
      </button>
      <div ref={setPopperRef} style={styles.popper} {...attributes.popper}>
        <DropdownContainer style={styles.offset} visible={visible}>
          <DropdownItem>Element</DropdownItem>
          <DropdownItem>Element</DropdownItem>
          <DropdownItem>Element</DropdownItem>
        </DropdownContainer>
      </div>
    </React.Fragment>
  );
}

export default Dropdown;

```

Output:

<iframe src="https://codesandbox.io/embed/2-react-popper-docs-dropdown-19kxt?fontsize=14&hidenavigation=1&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="2-react-popper-docs-dropdown"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

All is fine until you realize that the standard dropdown behavior is to close the dropdown on *document* click outside of your element. I could not find information in the popper docs ANYWHERE about this. I googled frantically for hours and all I could find were people using the old popper style (Manager, Provider, render props, etc). I was determined to get the hooks example to work. After all, *hooks are the way forward.*

As it turns out, the generally accepted way to handle closing a dropdown or modal on click outside your component was a document event listener where you check to see if the click target includes your element. After wrangling with React's refs and implementing a document body click listener, here's where I landed:

### [](https://dev.to/tannerhallman/using-usepopper-to-create-a-practical-dropdown-5bf8#final-result-code)Final Result Code[](<>)

Code:

```javascript
import React, { useState, useEffect, useRef } from "react";
import { usePopper } from "react-popper";
import styled from "styled-components";

function Dropdown(props) {
  const [visible, setVisibility] = useState(false);

  const referenceRef = useRef(null);
  const popperRef = useRef(null);

  const { styles, attributes } = usePopper(
    referenceRef.current,
    popperRef.current,
    {
      placement: "bottom",
      modifiers: [
        {
          name: "offset",
          enabled: true,
          options: {
            offset: [0, 10]
          }
        }
      ]
    }
  );
  useEffect(() => {
    // listen for clicks and close dropdown on body
    document.addEventListener("mousedown", handleDocumentClick);
    return () => {
      document.removeEventListener("mousedown", handleDocumentClick);
    };
  }, []);

  function handleDocumentClick(event) {
    if (referenceRef.current.contains(event.target)) {
      return;
    }
    setVisibility(false);
  }
  function handleDropdownClick(event) {
    setVisibility(!visible);
  }

  return (
    <React.Fragment>
      <button ref={referenceRef} onClick={handleDropdownClick}>
        Click Me
      </button>
      <div ref={popperRef} style={styles.popper} {...attributes.popper}>
        <DropdownContainer style={styles.offset} visible={visible}>
          <DropdownItem>Element</DropdownItem>
          <DropdownItem>Element</DropdownItem>
          <DropdownItem>Element</DropdownItem>
        </DropdownContainer>
      </div>
    </React.Fragment>
  );
}

const DropdownContainer = styled.div`
  display: ${props => (props.visible ? "flex" : "none")};
  width: "2px";
  flex-direction: column;
  background-color: "#FFF";
  border-radius: 4px;
  box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.14);
  padding: 5px;
`;

const DropdownItem = styled.div`
  justify-content: flex-start;
  height: 40px;
  padding-right: 10px;
  padding-left: 10px;
  align-items: center;

  &:hover {
    background-color: #00ffff;
  }
  &:active {
    font-weight: 700;
    color: #00ffff;
  }
`;

export default Dropdown;
```

Output:

<iframe src="https://codesandbox.io/embed/3-react-popper-realistic-dropdown-yun1q?fontsize=14&hidenavigation=1&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="3-react-popper-realistic-dropdown"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>



The important thing worth mentioning is that I used `useRef` instead of `useState` when creating refs which caused the actual ref objects to be accessed from `referenceRef.current` and `popperRef.current`.

Hopefully, this saves you time, headaches, and by translation, money! 🚀