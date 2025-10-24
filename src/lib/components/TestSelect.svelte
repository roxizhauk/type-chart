<script lang="ts">
	import MultiSelect from '$lib/components/ArraySelect.svelte';

	const options = [
		{ id: 1, value: 'chocolate', label: 'Chocolate', color: 'bg-orange-950' },
		{ id: 2, value: 'strawberry', label: 'Strawberry', color: 'bg-pink-950' },
		{ id: 3, value: 'vanilla', label: 'Vanilla', color: 'bg-yellow-950' },
		{ id: 4, value: 'mint', label: 'Mint', color: 'bg-green-950' }
	];

	let selected = $state<typeof options>([]);

	$effect(() => {
		if (selected.length > 0) console.log(selected[selected.length - 1].value);
	});
</script>

<MultiSelect bind:selected {options} isMulti />
