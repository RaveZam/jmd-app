export function computeBORateThisMonth(data: any) {
  let borate = 0;

  const bototal = data.reduce((sum: number, r: any) => r.boQty + sum, 0);

  const soldtotal = data.reduce((sum: number, r: any) => r.soldQty + sum, 0);

  borate = (bototal / soldtotal) * 100;

  return { borate };
}
