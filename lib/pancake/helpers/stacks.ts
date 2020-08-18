export function stacks (data:any[], keys:any[], i = (i:any) => i) {
	if (typeof i === 'string') {
		const key = i;
		i = d => d[key];
	}

	const stacks = data.map(d => {
		const stack = keys.map((key: any) => ({
			key,
			value: d[key],
			i: i(d),
			start: null,
			end: null
		}));

		let acc = 0;

		stack.forEach((d: any) => {
			d.start = acc;
			d.end = acc += d.value;
		});

		return stack;
	});

	return keys.map((key: any) => ({
		key,
		values: stacks.map(s => {
			return s.find((d: any) => d.key === key);
		})
	}));
}