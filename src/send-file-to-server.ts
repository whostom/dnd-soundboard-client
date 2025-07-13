export default async function <T>(target: string, file: Blob): Promise<T> {
  // TODO: change this
  const address = "http://127.0.0.1:3000";
  console.log(`${address}/${target}`);

  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${address}/${target}`, {
    method: "POST",
    body: formData,
  });

  return await res.json();
}
