export default function parse(e) {
  e.preventDefault();
  var formData = new FormData(e.target);
  let values = {};
  for (var pair of formData.entries()) {
    values = { ...values, ...{ [pair[0]]: pair[1] } };
  }
  return values;
}
