for (const force of game.forces as unknown as LuaForce[]) {
	if (force.technologies["circuit-network"].researched) {
		force.recipes["musical-speaker"].enabled = true
	}
}
