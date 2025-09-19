export default function EpisodeHighlights({
  story,
  keyDetails,
  tryThis,
}: {
  story?: string[]
  keyDetails?: string[]
  tryThis?: string[]
}) {
  const showStory = Array.isArray(story) && story.length > 0
  const showKeyDetails = Array.isArray(keyDetails) && keyDetails.length > 0
  const showTryThis = Array.isArray(tryThis) && tryThis.length > 0
  const storyItems = showStory ? story ?? [] : []
  const keyDetailItems = showKeyDetails ? keyDetails ?? [] : []
  const tryThisItems = showTryThis ? tryThis ?? [] : []

  if (!showStory && !showKeyDetails && !showTryThis) return null

  return (
    <section id="highlights" className="not-prose card scroll-mt-20">
      <div className="card-body space-y-6">
        <h2 className="text-xl font-semibold text-blue-600">Story Practice Toolkit</h2>

        {showStory && (
          <div>
            <h3 className="font-semibold text-lg text-gray-900">Story</h3>
            <div className="mt-3 space-y-3 text-gray-800">
              {storyItems.map((paragraph, idx) => (
                <p key={`story-${idx}`}>{paragraph}</p>
              ))}
            </div>
          </div>
        )}

        {showKeyDetails && (
          <div>
            <h3 className="font-semibold text-lg text-gray-900">Key details</h3>
            <ul className="mt-3 list-disc list-inside space-y-2 text-gray-800">
              {keyDetailItems.map((item, idx) => (
                <li key={`key-${idx}`}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {showTryThis && (
          <div>
            <h3 className="font-semibold text-lg text-gray-900">Try this</h3>
            <ul className="mt-3 list-disc list-inside space-y-2 text-gray-800">
              {tryThisItems.map((item, idx) => (
                <li key={`try-${idx}`}>{item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  )
}
