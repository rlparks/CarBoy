<script lang="ts">
	import { resolve } from "$app/paths";
	import noImageImage from "$lib/assets/noimage.webp";
	import type { VehicleWithDepartment } from "$lib/types/bonus";

	type Props = {
		vehicle: VehicleWithDepartment;
		showButton?: boolean;
	};

	let { vehicle, showButton = true }: Props = $props();
</script>

<div
	class="flex flex-col overflow-hidden rounded-lg border border-gray-200 shadow-sm dark:border-gray-700"
>
	<!-- Status strip -->
	<div class={vehicle.isCheckedOut ? "h-1.5 bg-blue-500" : "h-1.5 bg-green-500"}></div>

	<!-- Vehicle image -->
	<img
		alt={vehicle.hasImage ? `Vehicle ${vehicle.number}` : "Solid black placeholder"}
		src={vehicle.hasImage ? `/api/images/vehicles/${vehicle.number}` : noImageImage}
	/>

	<!-- Main content -->
	<section class="flex flex-1 flex-col gap-2 p-3">
		<div class="flex items-start justify-between gap-1">
			<div class="min-w-0">
				<p class="truncate font-semibold">{vehicle.number}</p>
				<p class="truncate text-sm text-gray-500 dark:text-gray-400">{vehicle.name}</p>
			</div>
			<span
				class={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${vehicle.isCheckedOut ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300" : "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"}`}
			>
				{vehicle.isCheckedOut ? "Out" : "Available"}
			</span>
		</div>

		{#if vehicle.destinations || vehicle.startedByName}
			<div class="space-y-1 border-t border-gray-100 pt-2 dark:border-gray-700">
				{#if vehicle.destinations}
					<p class="truncate text-xs text-gray-500 dark:text-gray-400" title={vehicle.destinations}>
						{vehicle.destinations}
					</p>
				{/if}
				{#if vehicle.startedByName}
					<p
						class="truncate text-xs text-gray-500 dark:text-gray-400"
						title={vehicle.startedByName}
					>
						{vehicle.startedByName}
					</p>
				{/if}
			</div>
		{/if}

		{#if showButton}
			<a
				href={vehicle.isCheckedOut
					? resolve("/checkin/[vehicleNumber]", { vehicleNumber: vehicle.number })
					: resolve("/checkout/[vehicleNumber]", { vehicleNumber: vehicle.number })}
				class={`mt-auto block rounded px-3 py-1.5 text-center text-sm font-medium text-white transition-opacity hover:opacity-90 ${vehicle.isCheckedOut ? "bg-blue-500" : "bg-green-600"}`}
			>
				{vehicle.isCheckedOut ? "Check In" : "Check Out"}
			</a>
		{/if}
	</section>
</div>
