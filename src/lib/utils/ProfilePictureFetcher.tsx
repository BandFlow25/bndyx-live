import { useEffect } from "react";

interface ProfilePictureFetcherProps {
  facebookUrl?: string;
  instagramUrl?: string;
  onPictureFetched: (url: string) => void;
}

const ProfilePictureFetcher: React.FC<ProfilePictureFetcherProps> = ({
  facebookUrl,
  instagramUrl,
  onPictureFetched,
}) => {
  useEffect(() => {
    const fetchProfilePicture = async () => {
      // Exit early if no URLs provided
      if (!facebookUrl && !instagramUrl) return;

      try {
        if (facebookUrl) {
          // Only handle the simple facebook.com/username format
          // This is fast and reliable for properly configured pages
          const match = facebookUrl.match(/facebook\.com\/([a-zA-Z0-9.]{2,}[^/?]*)/);
          
          if (match && match[1]) {
            const username = match[1];
            // Skip common paths that aren't usernames
            const commonPaths = ['profile.php', 'people', 'pages', 'groups', 'events', 'photos', 'videos', 'p'];
            
            if (!commonPaths.includes(username)) {
              const profilePicUrl = `https://graph.facebook.com/${username}/picture?type=large`;
              onPictureFetched(profilePicUrl);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching profile picture:", error);
      }
    };

    fetchProfilePicture();
  }, [facebookUrl, instagramUrl, onPictureFetched]);

  return null;
};

export default ProfilePictureFetcher;