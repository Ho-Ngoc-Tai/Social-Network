import { gql } from '@apollo/client';

export const GET_NOTIFICATIONS_QUERY = gql`
  query GetNotifications($limit: Int, $cursor: String) {
    notifications(limit: $limit, cursor: $cursor) {
      id
      type
      user {
        id
        name
        avatar
      }
      post {
        id
        content
      }
      comment {
        id
        content
      }
      isRead
      createdAt
    }
  }
`;

export const GET_UNREAD_COUNT_QUERY = gql`
  query GetUnreadCount {
    unreadNotificationsCount
  }
`;

export const MARK_AS_READ_MUTATION = gql`
  mutation MarkAsRead($notificationId: ID!) {
    markNotificationAsRead(notificationId: $notificationId) {
      id
      isRead
    }
  }
`;

export const MARK_ALL_AS_READ_MUTATION = gql`
  mutation MarkAllAsRead {
    markAllNotificationsAsRead {
      success
      message
    }
  }
`;
