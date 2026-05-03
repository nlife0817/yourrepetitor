<template>
  <div class="slidev-layout deck-layout deck-layout--default">
    <DeckHeader variant="light" />
    <div class="deck-body">
      <slot />
    </div>
    <DeckFooter :page="$slidev.nav.currentPage" :total="$slidev.nav.total" />
  </div>
</template>
