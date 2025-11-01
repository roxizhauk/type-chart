<script lang="ts">
	import Select from '$lib/components/ArraySelect.svelte';
	import { loadLS, saveLS } from '$lib/ls';
	import { onMount } from 'svelte';
	import data from './data.json';
	import './style.css';
	import typeIcons from './svg_data.json';

	type TypeRatio = 0 | 0.5 | 1 | 2;
	type ElementType<T> = T extends (infer U)[] ? U : never;
	type TypeChart = Omit<ElementType<typeof data>, 'effect' | 'damage'> & {
		effect: TypeRatio[];
		damage: TypeRatio[];
	};

	const typeChart = data as TypeChart[];
	type Option = ElementType<typeof options>;
	const options = typeChart.map(({ name }, id) => {
		const value = name.toLowerCase();
		return {
			id,
			value,
			label: name,
			color: `bg-${value}`,
			style: `background-color: ${typeIcons[id]?.rect_fill[0]}`
		};
	});

	const key = 'color-mode';
	let colorMode = $state(false);
	onMount(() => {
		colorMode = loadLS(key, false);
	});

	let isAll = $state(true);
	let moveTypes: Option[] = $state([]);
	let moveTypeResult = $derived.by(() => {
		let moveTypeResult: TypeRatio[] = Array.from({ length: 18 }, () => 0);
		if (colorMode) {
			for (const { id } of moveTypes) {
				moveTypeResult = moveTypeResult.map((prevRatio, i) => {
					const currRatio = typeChart[id].effect[i];
					return Math.max(prevRatio, currRatio) as TypeRatio;
				});
			}
		}
		return moveTypeResult;
	});

	let raidType: Option[] = $state([]);
	let raidTypeResult = $derived.by(() => {
		let raidTypeResult: { pros: string[]; cons: string[] } = { pros: [], cons: [] };
		const selected = typeChart.find(({ name }) => name == raidType[0]?.label)!;
		selected?.damage.map((v, i) => {
			if (v == 1) return;
			if (v > 1) raidTypeResult.pros.push(typeChart[i].name);
			if (v < 1) raidTypeResult.cons.push(typeChart[i].name);
		});
		return raidTypeResult;
	});

	function handleColorMode() {
		if (moveTypes.length > 1) {
			colorMode = !colorMode;
			saveLS(key, colorMode);
		}
	}

	function handleShowChart() {
		if (moveTypes.length > 0) {
			isAll = false;
		}
	}

	$effect(() => {
		isAll = !(moveTypes.length > 0);
	});

	function genAllTableRowsIcon(ratio: TypeRatio) {
		switch (ratio) {
			case 2:
				return { icon: '😆', color: 'bg-good' };
			case 1:
				return { icon: '', color: '' };
			case 0.5:
				return { icon: '🥺', color: 'bg-bad' };
			case 0:
				return { icon: '😭', color: 'bg-immune2' };
		}
	}

	function genSelectedRowsIcon(ratio: TypeRatio) {
		switch (ratio) {
			case 2:
				return { icon: '🥺', color: 'bg-bad' };
			case 1:
				return { icon: '', color: '' };
			case 0.5:
				return { icon: '😆', color: 'bg-good' };
			case 0:
				return { icon: '😎', color: 'bg-immune' };
		}
	}
</script>

{#snippet typeIcon(iconData: { name: string; rect_fill: string[]; shapes: any[] })}
	<div style={`background-color: ${iconData.rect_fill[0]};`}>
		<svg
			data-name={iconData.name}
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 76.71 76.71"
			aria-hidden="true"
			role="img"
		>
			{#each iconData.shapes as shape}
				{#if shape.type === 'path'}
					<path d={shape.d} fill={'#fff'} transform={shape.transform} />
				{:else if shape.type === 'circle'}
					<circle
						cx={shape.cx}
						cy={shape.cy}
						r={shape.r}
						fill={'#fff'}
						transform={shape.transform}
					/>
				{/if}
			{/each}
		</svg>
	</div>
{/snippet}

<div class="z-20 col-span-2 md:col-span-1">
	<Select
		bind:selected={raidType}
		placeholder="Select Raid Type"
		{options}
		className="h-9 drop-shadow"
	/>
</div>
<div class="col-span-3 md:col-span-2">
	<div
		aria-label="Raid Type Effectiveness"
		class="ml-1 flex flex-col overflow-x-auto leading-tight font-medium whitespace-nowrap"
	>
		{#if raidType}
			<span class="text-good">{raidTypeResult.pros.join(' ')}</span>
			<span class="text-bad">{raidTypeResult.cons.join(' ')}</span>
		{/if}
	</div>
</div>
<div>
	<button
		aria-label="Color Mode Button"
		class={moveTypes.length < 2 || isAll ? 'btn-disabled' : 'btn-light'}
		onclick={handleColorMode}
	>
		Color Mode
	</button>
</div>
<div class="z-10 col-span-4 md:col-span-2">
	<Select
		isMulti
		bind:selected={moveTypes}
		placeholder="Select Move Types"
		{options}
		className="h-9 drop-shadow"
	/>
</div>
<div>
	<button
		aria-label="Show Chart Button"
		class={moveTypes.length > 0 && isAll ? 'btn-blue' : 'btn-disabled'}
		onclick={handleShowChart}
	>
		Show Chart
	</button>
</div>
<div>
	<button
		aria-label="Show All Button"
		class={moveTypes.length == 0 || isAll ? 'btn-disabled' : 'btn-blue'}
		onclick={() => {
			isAll = true;
		}}
	>
		Show All
	</button>
</div>
<div class="col-span-4">
	<div aria-label="Type Chart Table" class="w-full overflow-x-auto">
		<div class="grid-table grid grid-cols-19">
			<div>
				<div>
					<span class="text-transparent">😃</span>
				</div>
			</div>
			{#each typeIcons, index}
				<div class={[index == typeIcons.length - 1 && 'tr']}>
					{@render typeIcon(typeIcons[index])}
				</div>
			{/each}
			{#if isAll}
				{#each typeChart as { effect }, index}
					<div class={[index == typeChart.length - 1 && 'bl']}>
						{@render typeIcon(typeIcons[index])}
					</div>
					{#each effect as value}
						{@const { icon, color } = genAllTableRowsIcon(value)}
						<div>
							<div class={color}>
								<span>{icon}</span>
							</div>
						</div>
					{/each}
				{/each}
			{:else if moveTypes.length > 0}
				{#each moveTypes as { id, color: typeColor }, index}
					<div class={moveTypes.length == index + 1 ? 'bl' : ''}>
						{@render typeIcon(typeIcons[id])}
					</div>
					{#each typeChart[id].effect as v, i}
						{@const { icon, color } = genSelectedRowsIcon(v)}
						<div>
							<div class={colorMode ? genSelectedRowsIcon(moveTypeResult[i]).color : color}>
								<span>{icon}</span>
							</div>
						</div>
					{/each}
				{/each}
			{/if}
		</div>
	</div>
</div>
