---
title: Tell - The architecture
menu: Architecture
---

# Architecture
## Overview

Tell completely decouples storage and processing. This means that the architecture
consists of two layers: a storage layer and a processing layer. The processing layer
runs transactions and the storage layer stores the data. A bit oversimplyfied, this
is how the architecture looks like:

![architecture overview](/images/architecture.png)

This does not look as different as a classical partitioned database. But it is in
a sense that the storage layer does not execute transactions. It only delivers data.
So unlike in a partitioned database, each processing node has the full view of all
data stored in the processing layer - it does not own a partition.

Tell consists of several components, which are going to cover in this chapter:

* The storage nodes. These are dumb, but very fast storage nodes.
* The processing nodes implement the application logic and execute transactions.
* The commit manager makes sure that all transactions are globally ordered.

## Storage nodes
Unline in most other database systems, the storage nodes do not implement a
lot of logic. But it is still more than a simple key-value store. The reason
we don't use a key-value store (as described in the paper) is mostly for
performance. The version of Tell that used RamCloud had to fetch and write
more data than necassary. Also, it is very hard to implement efficient scans
over key-value pairs. It gets even more difficult as we want to push down
some simple operators to the storage.

### Relations
TellStore stores relations. But unlike a traditional relational database,
it does only support the most basic features. It does not check any integrity
constraints, it does not have any secondary indexes, the primary key is always
8 bytes long etc. All these features have to be implemented in the upper layer.
Furthermore does the storage layer not have any knowledge about transactions.
But it does support atomic operations on a tuple and it can keep several
versions of the same tuple.

### Versioning
Originally Tell used RamCloud to store data. As an optimization for transactional
workloads, TellStore now implements versioning. This means that a client has
to deliver a read set and its own version whenever it wants to read or write
a tuple.

