export default async function <T>(
  target: string,
  body: BodyInit | null | undefined,
): Promise<T> {
  // TODO: change this
  const address = "http://127.0.0.1:3000";
  console.log(`${address}/${target}`);
  const res = await fetch(`${address}/${target}`, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: body,
  });
  return await res.json();
}
