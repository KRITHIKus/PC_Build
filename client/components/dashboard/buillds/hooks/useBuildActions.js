'use client';

import {
  useRenameBuildMutation,
  useToggleFavoriteMutation,
  useUpdateJourneyStatusMutation,
  useDuplicateBuildMutation,
  useDeleteBuildMutation,
  useToggleFeaturedMutation,
} from '@/services/buildsApi';

export function useBuildActions() {
  const [renameBuild] = useRenameBuildMutation();
  const [toggleFavorite] = useToggleFavoriteMutation();
  const [updateJourneyStatus] = useUpdateJourneyStatusMutation();
  const [duplicateBuild] = useDuplicateBuildMutation();
  const [deleteBuild] = useDeleteBuildMutation();
  const [toggleFeatured] = useToggleFeaturedMutation();

  const handleRename = async (buildId, newTitle) => {
    if (!newTitle?.trim()) return;
    await renameBuild({ id: buildId, title: newTitle.trim() }); // ✅ 'title', not 'name'
  };

  const handleFavorite = async (build, isFavorite) => {
    await toggleFavorite({
      id: build._id,
      isFavorite,
      isDreamBuild: build.isDreamBuild,
    });
  };

  const handleJourneyChange = async (buildId, journeyStatus) => {
  await updateJourneyStatus({ id: buildId, journeyStatus });
};

  const handleDuplicate = async (buildId) => {
    await duplicateBuild({ id: buildId });
  };

  const handleDelete = async (buildId) => {
  await deleteBuild(buildId); // ✅ pass string directly
};

const handleToggleFeatured = async (build) => {
  await toggleFeatured({
    id: build._id,
    isFeatured: !build.isFeatured, // toggle
  });
};

  return {
    handleRename,
    handleFavorite,
    handleJourneyChange,
    handleDuplicate,
    handleDelete,
    handleToggleFeatured,
  };
}