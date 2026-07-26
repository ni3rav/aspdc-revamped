export function assertRankingSnapshotOwner(
    profileLogin: string,
    snapshotLogin: string
): void {
    if (profileLogin.toLowerCase() === snapshotLogin.toLowerCase()) return

    throw new Error(
        `Linked GitHub token resolved to @${snapshotLogin}, not profile @${profileLogin}.`
    )
}
