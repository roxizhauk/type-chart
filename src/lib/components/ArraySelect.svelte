<script lang="ts" generics="AdditionalOption">
	import { ChevronDown, X } from '@lucide/svelte';

	type SelectOption = {
		value: string;
		label: string;
		color?: string;
		style?: string;
	} & AdditionalOption;

	interface SelectProps {
		options: readonly SelectOption[];
		isMulti?: boolean;
		placeholder?: string;
		selected: SelectOption[];
		className?: string;
	}

	const menuId = `select-menu-${Math.random().toString(36).substring(2)}`;
	let showMenu = $state(false);
	let {
		options,
		isMulti,
		placeholder = isMulti ? 'Select Items' : 'Select Item',
		selected = $bindable(),
		className
	}: SelectProps = $props();

	$effect(() => {
		function handleClickOutside() {
			showMenu = false; // close menu when clicked outside
		}
		document.addEventListener('click', handleClickOutside, { capture: true });
		return () => document.removeEventListener('click', handleClickOutside);
	});

	function handleBodyClick() {
		showMenu = !showMenu; // toggle menu visibility
	}

	function handleDeselect(e: MouseEvent, item: SelectOption) {
		e.stopPropagation();
		selected = [...selected].filter(({ value }) => value !== item.value);
	}

	function handleClearAll(e: MouseEvent) {
		e.stopPropagation();
		selected = [];
	}

	function handleSelectOption(e: MouseEvent, option: SelectOption) {
		e.stopPropagation();
		selected = isMulti ? [...selected, option] : [option];
		showMenu = false;
	}
</script>

<div class={['h-8 w-full rounded bg-white', className]}>
	<div
		aria-label="Select body"
		onclick={handleBodyClick}
		onkeydown={() => {}}
		class="relative flex h-full w-full cursor-pointer items-center justify-between rounded border border-slate-200 px-1"
		role="combobox"
		tabindex={0}
		aria-controls={menuId}
		aria-expanded={showMenu}
	>
		<div class="peer w-full overflow-x-scroll pr-1.5">
			{#if selected.length > 0}
				<div class="flex gap-x-1">
					{#each selected as selectedOption}
						<button
							aria-label="Selected item"
							disabled={!isMulti}
							onclick={(e) => handleDeselect(e, selectedOption)}
							style={selectedOption.style}
							class={[
								'inline-flex items-center rounded-xs py-0.5 text-xs sm:text-sm',
								selectedOption.color,
								{
									'text-white': selectedOption.color,
									'cursor-pointer gap-x-1 pr-1 pl-1.5': isMulti,
									'px-1': !isMulti
								}
							]}
						>
							<div>{selectedOption.label}</div>
							{#if isMulti}
								<X aria-label="Remove selected item" class="h-full w-3" />
							{/if}
						</button>
					{/each}
				</div>
			{:else}
				<div class="pl-0.5 text-xs whitespace-nowrap sm:text-sm">{placeholder}</div>
			{/if}
		</div>
		{#if isMulti && selected.length > 0}
			<X
				aria-label="Clear all selected items"
				onclick={(e) => handleClearAll(e)}
				class="h-full w-5 duration-300 ease-in hover:scale-125 hover:text-red-400"
			/>
		{/if}
		<ChevronDown
			aria-label="Open select menu"
			class="h-full w-6 duration-300 ease-in peer-hover:scale-125 peer-hover:text-blue-400 hover:scale-125 hover:text-blue-400"
		/>
	</div>
	{#if showMenu}
		<div
			id={menuId}
			role="listbox"
			aria-label="Select menu"
			class="absolute z-50 mt-1 flex max-h-screen flex-col overflow-visible overflow-y-auto rounded border border-slate-200 bg-white p-2 drop-shadow-xl"
		>
			{#each options as option}
				{#if !selected.find((item) => item.value == option.value && item.label == option.label)}
					<button
						aria-label="Select item"
						onclick={(e) => handleSelectOption(e, option)}
						class="cursor-pointer py-1 pr-5 pl-2 text-start text-sm transition-colors hover:text-blue-400"
					>
						{option.label}
					</button>
				{/if}
			{/each}
		</div>
	{/if}
</div>
