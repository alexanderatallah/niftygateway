export function messagePopUpWindow(popup, counter) {
  //recursion
  if (counter == 10) {
    return "done";
  } else {
    //wheeeeeee
    setTimeout(function () {
      console.log('sending message ' + counter);
      popup.postMessage("ez_kitties_message", '*');
      counter = counter + 1;
      return messagePopUpWindow(popup, counter);
    }, 1000);
  }
}