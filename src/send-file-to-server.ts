export default async function <T>(
  target: string,
  file: Blob,
  data: Record<string, unknown> | undefined = undefined,
): Promise<T> {
  const address = "http://127.0.0.1:3000";
  console.log(`${address}/${target}`);

  const formData = new FormData();
  formData.append("file", file);
  if (data != undefined) {
    for (const key in data) {
      const value = data[key];

      if (typeof value === "string") {
        formData.append(key, value);
      } else if (typeof value === "number") {
        formData.append(key, value.toString());
      } else {
        formData.append(key, JSON.stringify(value));
      }
    }
  }

  const res = await fetch(`${address}/${target}`, {
    method: "POST",
    body: formData,
  });

  return await res.json();
}
