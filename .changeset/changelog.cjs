// Keep source context and Pi adaptations together in the release changelog.
// No network requests or GitHub credentials are needed for versioning.
module.exports = {
  async getReleaseLine(changeset) {
    const summary = changeset.summary.trim().replace(/^## /gm, '##### ');
    return `#### Port record: ${changeset.id}\n\n${summary}`;
  },
  async getDependencyReleaseLine(changesets, dependenciesUpdated) {
    if (dependenciesUpdated.length === 0) return '';
    return `Updated dependencies:\n${dependenciesUpdated.map(({ name, newVersion }) => `- ${name}@${newVersion}`).join('\n')}`;
  },
};
