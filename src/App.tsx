import { useState } from "react";
import Alert from "./components/Alert";
import Button from "./components/Button";
import RHForm from "./components/RHForm";
import Like from "./components/Like";
import ListGroup from "./components/ListGroup";

function App() {
  // State variable and update function for counting
  const [count, setCount] = useState(0);

  // State variable and update function for alerts
  const [displayAlert, setDisplayAlert] = useState(false);

  // State variable and update function for like button
  const [isLiked, setIsLiked] = useState(false);

  // State variable and update function for list
  const [items, setItems] = useState([
    "Apples",
    "Oranges",
    "Political Discord",
    "Bread",
  ]);

  return (
    <>
      {/*Naive approach*/}
      <button
        type="button"
        onClick={() => {
          console.log("BUTTON CLICKED");
        }}
      >
        BUTTON
      </button>
      <br />

      {/*This renders a simple button component with incrementing behaviour*/}
      {/*EXERCISE: Create a button that adds characters to it's text*/}
      <Button onClick={() => setCount(count + 1)}>{count.toString()}</Button>
      <br />

      {/*Here we conditionally render the Alert component*/}
      {displayAlert && (
        <Alert onClick={() => setDisplayAlert(false)}>
          This is an <b>ALERT</b>
        </Alert>
      )}

      {/*EXERCISE: Create a button to conditionally render another element of your choice*/}
      <Button color="warning" onClick={() => setDisplayAlert(true)}>
        SHOW ALARM
      </Button>
      <br />

      {/*REFERENCE ONLY - NO EXERCISE*/}
      <Like color="red" status={isLiked} onClick={() => setIsLiked(!isLiked)} />
      <br />

      {/*EXERCISE: Create a button that will remove from the list*/}
      <ListGroup
        items={items}
        heading="Shopping List"
        onSelectItem={(item) => console.log(item)}
      />
      <Button color="danger" onClick={() => setItems([...items, "Spam"])}>
        Add Spam!
      </Button>
      <br />

      {/*EXERCISE: Add fields to form */}
      {/*CHALLENGE EXERCISE: Modify code for form to add to a list*/}
      <RHForm onSubmit={(data) => console.log(data)} />
    </>
  );
}

export default App;
