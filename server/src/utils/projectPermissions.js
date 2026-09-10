const getMembership = (project, userId) => {
  if (!project || !project.members || !Array.isArray(project.members) || !userId) {
    return undefined;
  }

  const targetUserId = userId.toString();

  return project.members.find((member) => {
    const memberUserId = member.user?._id || member.user;
    return memberUserId && memberUserId.toString() === targetUserId;
  });
};

const isOwner = (project, userId) => {
  if (!project || !project.owner || !userId) {
    return false;
  }

  const ownerId = project.owner?._id || project.owner;
  return ownerId.toString() === userId.toString();
};

const isAdmin = (project, userId) => {
  if (!project || !userId) {
    return false;
  }

  const membership = getMembership(project, userId);

  return (
    isOwner(project, userId) ||
    membership?.role === "ADMIN"
  );
};

const isMember = (project, userId) => {
  if (!project || !userId) {
    return false;
  }

  return isOwner(project, userId) || !!getMembership(project, userId);
};

module.exports = {
  getMembership,
  isOwner,
  isAdmin,
  isMember
};